use super::{serialize_option_oid_hex, Card};
use bson::oid::ObjectId;
use chrono::{DateTime, Utc};
use enum_as_inner::EnumAsInner;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum TransactionStatus {
    Waiting,
    Completed,
    Cancelled,
}

#[derive(Serialize, Deserialize, Debug, Clone, EnumAsInner)]
#[serde(tag = "type")]
pub enum TransactionType {
    Marketplace {
        price: u32,
        sender_card: ObjectId,
    },
    Transfer {
        sender_cards: Vec<ObjectId>,
        receiver_cards: Vec<ObjectId>,
    },
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "type")]
pub enum PopulatedTransactionType {
    Marketplace {
        price: u32,
        sender_card: Card,
    },
    Transfer {
        sender_cards: Vec<Card>,
        receiver_cards: Vec<Card>,
    },
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
    #[serde(with = "bson::serde_helpers::chrono_datetime_as_bson_datetime")]
    pub created_at: DateTime<Utc>,
    #[serde(with = "bson::serde_helpers::chrono_datetime_as_bson_datetime")]
    pub completed_at: DateTime<Utc>,
    pub status: TransactionStatus,
    pub transaction_type: TransactionType,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PopulatedTransaction {
    #[serde(
        rename = "_id",
        skip_serializing_if = "Option::is_none",
        serialize_with = "serialize_option_oid_hex"
    )]
    id: Option<ObjectId>,
    pub sender_id: ObjectId,
    pub receiver_id: Option<ObjectId>,
    #[serde(with = "bson::serde_helpers::chrono_datetime_as_bson_datetime")]
    pub created_at: DateTime<Utc>,
    #[serde(with = "bson::serde_helpers::chrono_datetime_as_bson_datetime")]
    pub completed_at: DateTime<Utc>,
    pub status: TransactionStatus,
    pub transaction_type: PopulatedTransactionType,
}

impl std::str::FromStr for TransactionStatus {
    type Err = ();

    fn from_str(s: &str) -> std::result::Result<Self, Self::Err> {
        match s {
            "Waiting" => Ok(TransactionStatus::Waiting),
            "Completed" => Ok(TransactionStatus::Completed),
            "Cancelled" => Ok(TransactionStatus::Cancelled),
            _ => Err(()),
        }
    }
}

impl TransactionStatus {
    pub fn to_string(&self) -> String {
        match self {
            TransactionStatus::Waiting => "Waiting".to_string(),
            TransactionStatus::Completed => "Completed".to_string(),
            TransactionStatus::Cancelled => "Cancelled".to_string(),
        }
    }
}

impl Transaction {
    pub fn new(
        id: Option<ObjectId>,
        sender_id: ObjectId,
        receiver_id: Option<ObjectId>,
        created_at: DateTime<Utc>,
        completed_at: DateTime<Utc>,
        status: TransactionStatus,
        transaction_type: TransactionType,
    ) -> Self {
        Self {
            id,
            sender_id,
            receiver_id,
            created_at,
            completed_at,
            status,
            transaction_type,
        }
    }

    pub fn from_marketplace(sender_id: ObjectId, card_id: ObjectId, price: u32) -> Self {
        Self {
            id: None,
            sender_id,
            receiver_id: None,
            created_at: Utc::now(),
            completed_at: Utc::now(),
            status: TransactionStatus::Waiting,
            transaction_type: TransactionType::Marketplace {
                price,
                sender_card: card_id,
            },
        }
    }

    pub fn get_sender_card_ids(&self) -> Vec<ObjectId> {
        match &self.transaction_type {
            TransactionType::Marketplace {
                price: _,
                sender_card,
            } => vec![sender_card.clone()],
            TransactionType::Transfer {
                sender_cards,
                receiver_cards: _,
            } => sender_cards.clone(),
        }
    }

    pub fn get_receiver_card_ids(&self) -> Vec<ObjectId> {
        match &self.transaction_type {
            TransactionType::Marketplace {
                price: _,
                sender_card: _,
            } => vec![],
            TransactionType::Transfer {
                sender_cards: _,
                receiver_cards,
            } => receiver_cards.clone(),
        }
    }
}

impl PopulatedTransaction {
    pub fn from_transaction(
        transaction: Transaction,
        populated_transaction: PopulatedTransactionType,
    ) -> Self {
        Self {
            id: transaction.id,
            sender_id: transaction.sender_id,
            receiver_id: transaction.receiver_id,
            created_at: transaction.created_at,
            completed_at: transaction.completed_at,
            status: transaction.status,
            transaction_type: populated_transaction,
        }
    }
}

impl PopulatedTransactionType {
    pub fn from_transaction_type(
        transaction_type: &TransactionType,
        sender_cards_pop: Vec<Card>,
        receiver_cards_pop: Vec<Card>,
    ) -> Self {
        match transaction_type {
            TransactionType::Marketplace {
                price,
                sender_card: _,
            } => PopulatedTransactionType::Marketplace {
                price: price.clone(),
                sender_card: sender_cards_pop.first().unwrap().clone(),
            },
            TransactionType::Transfer {
                sender_cards: _,
                receiver_cards: _,
            } => PopulatedTransactionType::Transfer {
                sender_cards: sender_cards_pop,
                receiver_cards: receiver_cards_pop,
            },
        }
    }
}
