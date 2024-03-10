use crate::{db::MongoClient, models::Card};
use bson::oid::ObjectId;
use futures::TryStreamExt;
use mongodb::{bson::doc, error::Result};

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

    pub async fn save_card(&self, card: &Card) -> Result<ObjectId> {
        let coll = self._database.collection::<Card>("Card");
        let res = coll.insert_one(card, None).await?;
        Ok(res.inserted_id.as_object_id().unwrap())
    }

    pub async fn get_card_of_user(&self, user: &ObjectId) -> Result<Vec<Card>> {
        let coll = self._database.collection::<Card>("Card");
        coll.find(doc! {"owner": user}, None)
            .await?
            .try_collect()
            .await
    }
}
