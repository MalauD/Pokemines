use super::serialize_option_oid_hex;
use bson::oid::ObjectId;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum TransactionStatus {
    Waiting,
    Completed,
    Cancelled,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum TransactionType {
    Marketplace,
    Transfer,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Transaction {
    #[serde(
        rename = "_id",
        skip_serializing_if = "Option::is_none",
        serialize_with = "serialize_option_oid_hex"
    )]
    id: Option<ObjectId>,
    pub sender_id: ObjectId,
    pub receiver_id: Option<ObjectId>,
    pub card_id: ObjectId,
    #[serde(with = "bson::serde_helpers::chrono_datetime_as_bson_datetime")]
    pub created_at: DateTime<Utc>,
    #[serde(with = "bson::serde_helpers::chrono_datetime_as_bson_datetime")]
    pub completed_at: DateTime<Utc>,
    pub status: TransactionStatus,
    pub price: Option<u32>,
    pub transaction_type: TransactionType,
}
