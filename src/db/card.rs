use crate::{
    db::MongoClient,
    models::{
        Card, CardsRarityPoints, GroupedCard, PopulatedCard, RandomCardSelectionSettings, User,
    },
};
use bson::bson;
use bson::oid::ObjectId;
use futures::{StreamExt, TryStreamExt};
use mongodb::{bson::doc, error::Result, options::FindOneOptions};

impl MongoClient {
    pub async fn get_card_by_id(&self, id: &ObjectId) -> Result<Option<Card>> {
        let coll = self._database.collection::<Card>("Card");
        coll.find_one(
            doc! {
                "_id": id
            },
            None,
        )
        .await
    }

    pub async fn save_cards(&self, card: &Card, card_count: u32) -> Result<Vec<ObjectId>> {
        let coll = self._database.collection::<Card>("Card");
        let cards = (0..card_count).map(|_| card.clone()).collect::<Vec<_>>();
        let res = coll.insert_many(cards, None).await?;
        Ok(res
            .inserted_ids
            .values()
            .map(|d| d.as_object_id().unwrap())
            .collect())
    }

    pub async fn get_last_created_cards(&self, limit: usize) -> Result<Vec<Card>> {
        let coll = self._database.collection::<Card>("Card");
        let pipeline = vec![
            doc! {
                "$sort": {
                    "_id": -1
                }
            },
            doc! {
                "$group": {
                    "_id": "$card_number",
                    "card": {
                        "$first": "$$ROOT"
                    }

                }
            },
            doc! {
                "$limit": limit as i64
            },
        ];

        Ok(coll
            .aggregate(pipeline, None)
            .await?
            .map(|x| bson::from_document(x.unwrap().get_document("card").unwrap().clone()))
            .try_collect()
            .await?)
    }

    pub async fn get_card_of_user(&self, user: &ObjectId) -> Result<Vec<Card>> {
        let coll = self._database.collection::<Card>("Card");
        coll.find(doc! {"owner": user}, None)
            .await?
            .try_collect()
            .await
    }

    pub async fn get_card_of_user_grouped(&self, user: &ObjectId) -> Result<Vec<GroupedCard>> {
        let coll = self._database.collection::<Card>("Card");
        let pipeline = vec![
            doc! {
                "$match": {
                    "owner": user
                }
            },
            doc! {
                "$group": {
                    "_id": "$card_number",
                    "cards": {
                        "$push": "$$ROOT"
                    }
                }
            },
        ];
        Ok(coll
            .aggregate(pipeline, None)
            .await?
            .map(|x| bson::from_document(x.unwrap()))
            .try_collect()
            .await?)
    }

    pub async fn get_card_by_number(&self, card_number: u32) -> Result<Vec<PopulatedCard>> {
        let coll = self._database.collection::<Card>("Card");
        let pipeline = vec![
            doc! {
                "$match": {
                    "card_number": card_number
                }
            },
            doc! {
                "$lookup": {
                    "from": "User",
                    "localField": "owner",
                    "foreignField": "_id",
                    "as": "owner"
                }
            },
            doc! {
                "$unwind": "$owner"
            },
        ];
        Ok(coll
            .aggregate(pipeline, None)
            .await?
            .map(|x| bson::from_document(x.unwrap()))
            .try_collect()
            .await?)
    }

    pub async fn get_last_card_number(&self) -> Result<u32> {
        // Get max of card_number of all cards
        let coll = self._database.collection::<Card>("Card");
        let find_options = FindOneOptions::builder()
            .sort(doc! {"card_number": -1})
            .build();

        // Sort by card_number and get the last one
        let last_card = coll.find_one(None, find_options).await?;

        match last_card {
            Some(card) => Ok(card.card_number),
            None => Ok(0),
        }
    }

    pub async fn get_cards_from_ids(&self, ids: Vec<ObjectId>) -> Result<Vec<Card>> {
        let coll = self._database.collection::<Card>("Card");
        coll.find(doc! {"_id": {"$in": ids}}, None)
            .await?
            .try_collect()
            .await
    }

    pub async fn transfer_card(
        &self,
        card: &ObjectId,
        sender: &ObjectId,
        receiver: &ObjectId,
    ) -> Result<()> {
        let coll = self._database.collection::<Card>("Card");
        coll.update_one(doc! {"_id": card}, doc! {"$set": {"owner": receiver}}, None)
            .await?;
        let coll = self._database.collection::<User>("User");
        coll.update_one(
            doc! {"_id": receiver},
            doc! {"$push": {"cards": card}},
            None,
        )
        .await?;
        coll.update_one(doc! {"_id": sender}, doc! {"$pull": {"cards": card}}, None)
            .await?;
        Ok(())
    }

    pub async fn transfer_cards(
        &self,
        cards: &Vec<ObjectId>,
        sender: &ObjectId,
        receiver: &ObjectId,
    ) -> Result<()> {
        let coll = self._database.collection::<Card>("Card");
        coll.update_many(
            doc! {"_id": {"$in": cards}},
            doc! {"$set": {"owner": receiver}},
            None,
        )
        .await?;
        let coll = self._database.collection::<User>("User");
        coll.update_one(
            doc! {"_id": receiver},
            doc! {"$push": {"cards": {"$each": cards}}},
            None,
        )
        .await?;
        coll.update_one(
            doc! {"_id": sender},
            doc! {"$pull": {"cards": {"$in": cards}}},
            None,
        )
        .await?;
        Ok(())
    }

    pub async fn get_random_cards_with_settings(
        &self,
        from_owner: &ObjectId,
        settings: &RandomCardSelectionSettings,
        card_points: &CardsRarityPoints,
        exclude_cards: &Vec<ObjectId>,
    ) -> Result<Option<Vec<Card>>> {
        let coll = self._database.collection::<Card>("Card");
        let RandomCardSelectionSettings(settings) = settings;
        let create_sub_pipeline = |rarity_index: usize| -> bson::Bson {
            bson! ([{
                "$match": {
                    "_id": {
                        "$nin": exclude_cards
                    },
                    "points": {
                        "$gt": card_points.get_points_min(rarity_index),
                        "$lt": card_points.get_points_max(rarity_index)
                    },
                    "owner": from_owner,
                }
            },
            {
                "$sample": {
                    "size": settings[rarity_index]
                }
            }])
        };
        let sub_pipelines: bson::Document = bson::Document::from_iter(
            settings
                .iter()
                .enumerate()
                .map(|(i, _)| (i.to_string(), create_sub_pipeline(i))),
        );
        let pipeline = vec![doc! {
            "$facet": sub_pipelines
        }];
        let res = coll
            .aggregate(pipeline, None)
            .await?
            .next()
            .await
            .unwrap()?;
        let mut cards = vec![];
        for i in 0..settings.len() {
            cards.extend(
                res.get_array(i.to_string())
                    .unwrap()
                    .iter()
                    .map(|x| bson::from_bson(x.clone()).unwrap()),
            );
        }
        let total_expected = settings.iter().sum::<u32>();
        if total_expected != cards.len() as u32 {
            return Ok(None);
        }

        Ok(Some(cards))
    }
}
