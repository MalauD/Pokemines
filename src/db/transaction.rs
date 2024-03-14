use crate::{
    db::MongoClient,
    models::{Transaction, TransactionStatus},
};
use bson::oid::ObjectId;
use futures::TryStreamExt;
use mongodb::{bson::doc, error::Result};

impl MongoClient {
    pub async fn put_cards_in_marketplace(
        &self,
        card_ids: Vec<ObjectId>,
        price: u32,
        sender_id: ObjectId,
    ) -> Result<()> {
        let coll = self._database.collection::<Transaction>("Transaction");
        let transaction: Vec<Transaction> = card_ids
            .iter()
            .map(|c| Transaction::from_marketplace(sender_id, *c, price))
            .collect();
        coll.insert_many(transaction, None).await?;
        Ok(())
    }

    pub async fn buy_card_from_marketplace(
        &self,
        transaction_id: ObjectId,
        receiver_id: ObjectId,
    ) -> Result<()> {
        let coll = self._database.collection::<Transaction>("Transaction");
        coll.update_one(
            doc! {"_id": transaction_id},
            doc! {
                "$set": {
                    "status": TransactionStatus::Completed.to_string(),
                    "receiver_id": receiver_id,
                    "completed_at": chrono::Utc::now()
                }
            },
            None,
        )
        .await?;
        Ok(())
    }

    pub async fn cancel_transaction(&self, transaction_id: ObjectId) -> Result<()> {
        let coll = self._database.collection::<Transaction>("Transaction");
        coll.update_one(
            doc! {"_id": transaction_id},
            doc! {
                "$set": {
                    "status": TransactionStatus::Cancelled.to_string(),
                    "completed_at": chrono::Utc::now()
                }
            },
            None,
        )
        .await?;
        Ok(())
    }

    pub async fn get_waiting_transaction_marketplace(&self) -> Result<Vec<Transaction>> {
        let coll = self._database.collection::<Transaction>("Transaction");
        coll.find(
            doc! {"status": TransactionStatus::Waiting.to_string(), "transaction_type.type":  "Marketplace"},
            None,
        )
        .await?
        .try_collect()
        .await
    }

    pub async fn get_transaction_by_id(&self, id: &ObjectId) -> Result<Option<Transaction>> {
        let coll = self._database.collection::<Transaction>("Transaction");
        Ok(coll.find_one(doc! {"_id": id}, None).await?)
    }
}
