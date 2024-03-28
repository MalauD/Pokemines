use super::{serialize_option_oid_hex, PublicUser};
use actix_multipart::form::{tempfile::TempFile, text::Text, MultipartForm};
use bson::oid::ObjectId;
use rand::Rng;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Card {
    #[serde(
        rename = "_id",
        skip_serializing_if = "Option::is_none",
        serialize_with = "serialize_option_oid_hex"
    )]
    pub id: Option<ObjectId>,
    pub name: String,
    pub points: u32,
    pub strength: String,
    pub weakness: String,
    pub card_number: u32,
    pub owner: ObjectId,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PopulatedCard {
    #[serde(
        rename = "_id",
        skip_serializing_if = "Option::is_none",
        serialize_with = "serialize_option_oid_hex"
    )]
    pub id: Option<ObjectId>,
    pub name: String,
    pub points: u32,
    pub strength: String,
    pub weakness: String,
    pub card_number: u32,
    pub owner: PublicUser,
}

#[derive(MultipartForm)]
pub struct CardReq {
    pub name: Text<String>,
    pub points: Text<u32>,
    pub strength: Text<String>,
    pub weakness: Text<String>,
    pub image: TempFile,
    pub card_count: Text<u32>,
    pub price: Text<u32>,
    pub card_in_marketplace: Text<bool>,
}

impl Card {
    pub fn from_req(card: CardReq, card_number: u32, owner: ObjectId) -> Self {
        Card {
            id: None,
            name: card.name.to_string(),
            points: card.points.0,
            strength: card.strength.to_string(),
            weakness: card.weakness.to_string(),
            card_number,
            owner,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GroupedCard {
    pub _id: u32,
    pub cards: Vec<Card>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CardRarityPoints {
    pub min: u32,
    pub max: u32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CardsRarityPoints(pub Vec<CardRarityPoints>);

impl CardsRarityPoints {
    pub fn get_points_min(&self, rarity: usize) -> u32 {
        self.0[rarity as usize].min
    }

    pub fn get_points_max(&self, rarity: usize) -> u32 {
        self.0[rarity as usize].max
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct RandomCardSelectionSettings(pub Vec<u32>);

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct BoosterOption {
    pub probability: f32,
    pub composition: RandomCardSelectionSettings,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Booster {
    pub name: String,
    pub image_path: String,
    pub price: u32,
    pub options: Vec<BoosterOption>,
}

impl Booster {
    pub fn get_card_selection_rand(&self) -> RandomCardSelectionSettings {
        // Use the probability to select the booster option
        let mut rng = rand::thread_rng();
        let rand_num = rng.gen::<f32>();
        let mut prob_sum = 0.0;
        let mut selected_option = 0;
        for (i, option) in self.options.iter().enumerate() {
            prob_sum += option.probability;
            if rand_num < prob_sum {
                selected_option = i;
                break;
            }
        }
        self.options[selected_option].composition.clone()
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct BoostersSettings(pub Vec<Booster>);
