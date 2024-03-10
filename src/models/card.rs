use super::serialize_option_oid_hex;
use actix_multipart::form::{tempfile::TempFile, text::Text, MultipartForm};
use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Card {
    #[serde(
        rename = "_id",
        skip_serializing_if = "Option::is_none",
        serialize_with = "serialize_option_oid_hex"
    )]
    id: Option<ObjectId>,
    pub name: String,
    pub points: u32,
    pub strength: String,
    pub weakness: String,
    pub owner: Option<ObjectId>,
}

#[derive(MultipartForm)]
pub struct CardReq {
    pub name: Text<String>,
    pub points: Text<u32>,
    pub strength: Text<String>,
    pub weakness: Text<String>,
    pub owner: Text<Option<ObjectId>>,
    pub image: TempFile,
}

impl From<CardReq> for Card {
    fn from(card: CardReq) -> Self {
        Card {
            id: None,
            name: card.name.to_string(),
            points: card.points.0,
            strength: card.strength.to_string(),
            weakness: card.weakness.to_string(),
            owner: card.owner.0,
        }
    }
}