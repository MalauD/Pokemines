use crate::{
    db::MongoClient,
    models::{Card, GroupedCard, PopulatedCard, User},
};
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
}
