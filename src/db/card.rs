use crate::{db::MongoClient, models::Card};
use bson::oid::ObjectId;
use futures::TryStreamExt;
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
}
