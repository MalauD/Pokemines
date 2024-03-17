use crate::{
    db::MongoClient,
    models::{GroupedPopulatedTransaction, PopulatedTransaction, Transaction, TransactionStatus},
};
use bson::{oid::ObjectId, Document};
use futures::{StreamExt, TryStreamExt};
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

    pub async fn get_waiting_transaction_marketplace(&self) -> Result<Vec<PopulatedTransaction>> {
        let coll = self._database.collection::<Transaction>("Transaction");
        let pipeline = vec![
            doc! {
                "$match": {
                    "status": TransactionStatus::Waiting.to_string(),
                    "transaction_type.type":  "Marketplace"
                }
            },
            doc! {
                "$lookup": {
                    "from": "Card",
                    "localField": "transaction_type.sender_card",
                    "foreignField": "_id",
                    "as": "card"
                }
            },
            doc! {
                "$unwind": "$card"
            },
            doc! {
                "$lookup": {
                    "from": "User",
                    "localField": "sender_id",
                    "foreignField": "_id",
                    "as": "sender"
                }
            },
            doc! {
                "$unwind": "$sender"
            },
            doc! {
                "$set": {
                    "transaction_type.sender_card": "$card"
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

    pub async fn get_waiting_transaction_marketplace_grouped(
        &self,
    ) -> Result<Vec<GroupedPopulatedTransaction>> {
        let coll = self._database.collection::<Transaction>("Transaction");
        let pipeline = vec![
            doc! {
                "$match": {
                    "status": TransactionStatus::Waiting.to_string(),
                    "transaction_type.type":  "Marketplace"
                }
            },
            doc! {
                "$lookup": {
                    "from": "Card",
                    "localField": "transaction_type.sender_card",
                    "foreignField": "_id",
                    "as": "card"
                }
            },
            doc! {
                "$unwind": "$card"
            },
            doc! {
                "$lookup": {
                    "from": "User",
                    "localField": "sender_id",
                    "foreignField": "_id",
                    "as": "sender"
                }
            },
            doc! {
                "$unwind": "$sender"
            },
            doc! {
                "$set": {
                    "transaction_type.sender_card": "$card"
                }
            },
            doc! {
                "$group": {
                    "_id": "$transaction_type.sender_card.card_number",
                    "transactions": {
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

    pub async fn get_transaction_by_id(
        &self,
        id: &ObjectId,
    ) -> Result<Option<PopulatedTransaction>> {
        let coll = self._database.collection::<Transaction>("Transaction");
        let pipeline = vec![
            doc! {
                "$match": {
                    "status": TransactionStatus::Waiting.to_string(),
                    "transaction_type.type":  "Marketplace"
                }
            },
            doc! {
                "$match": {
                    "_id": id
                }
            },
            doc! {
                "$lookup": {
                    "from": "Card",
                    "localField": "transaction_type.sender_card",
                    "foreignField": "_id",
                    "as": "card"
                }
            },
            doc! {
                "$unwind": "$card"
            },
            doc! {
                "$lookup": {
                    "from": "User",
                    "localField": "sender_id",
                    "foreignField": "_id",
                    "as": "sender"
                }
            },
            doc! {
                "$unwind": "$sender"
            },
            doc! {
                "$set": {
                    "transaction_type.sender_card": "$card"
                }
            },
        ];
        let doc = coll
            .aggregate(pipeline, None)
            .await?
            .next()
            .await
            .ok_or_else(|| {
                mongodb::error::Error::from(std::io::Error::new(
                    std::io::ErrorKind::NotFound,
                    "Not found",
                ))
            })??;
        Ok(Some(bson::from_document(doc)?))
    }

    pub async fn get_transactions_by_number(
        &self,
        card_number: u32,
    ) -> Result<Vec<PopulatedTransaction>> {
        let coll = self._database.collection::<Transaction>("Transaction");
        let pipeline = vec![
            doc! {
                "$match": {
                    "status": TransactionStatus::Waiting.to_string(),
                    "transaction_type.type":  "Marketplace"
                }
            },
            doc! {
                "$lookup": {
                    "from": "Card",
                    "localField": "transaction_type.sender_card",
                    "foreignField": "_id",
                    "as": "card"
                }
            },
            doc! {
                "$unwind": "$card"
            },
            doc! {
                "$set": {
                    "transaction_type.sender_card": "$card"
                }
            },
            doc! {
                "$match": {
                    "transaction_type.sender_card.card_number": card_number
                }
            },
            doc! {
                "$lookup": {
                    "from": "User",
                    "localField": "sender_id",
                    "foreignField": "_id",
                    "as": "sender"
                }
            },
            doc! {
                "$unwind": "$sender"
            },
        ];
        Ok(coll
            .aggregate(pipeline, None)
            .await?
            .map(|x| bson::from_document(x.unwrap()))
            .try_collect::<Vec<PopulatedTransaction>>()
            .await?)
    }

    pub async fn complete_marketplace_transaction(
        &self,
        transaction_id: &ObjectId,
        receiver_id: &ObjectId,
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
}
