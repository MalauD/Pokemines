use bson::{oid::ObjectId, serde_helpers::serialize_object_id_as_hex_string};
use serde::{Deserialize, Serialize};

use meilisearch_sdk::{errors::Error, task_info::TaskInfo};

use crate::{
    models::{Card, Promo, User},
    search::MeilisearchClient,
    tools::PaginationOptions,
};

#[derive(Serialize, Deserialize)]
pub struct CardMeilisearch {
    pub card_number: u32,
    pub points: u32,
    pub name: String,
    pub strength: String,
    pub weakness: String,
}

impl From<Card> for CardMeilisearch {
    fn from(card: Card) -> Self {
        CardMeilisearch {
            card_number: card.card_number,
            name: card.name,
            points: card.points,
            strength: card.strength,
            weakness: card.weakness,
        }
    }
}

impl MeilisearchClient {
    pub async fn init_cards_index(&self) -> Result<(), Error> {
        let index = self.client.index("cards");
        let _ = index
            .set_searchable_attributes(&["name", "strength", "weakness"])
            .await?;
        let _ = index
            .set_ranking_rules(&[
                "words",
                "typo",
                "proximity",
                "attribute",
                "exactness",
                "sort",
                "points:desc",
            ])
            .await?;
        Ok(())
    }

    pub async fn index_cards(&self, cards: Vec<Card>) -> Result<TaskInfo, Error> {
        let index = self.client.index("cards");
        let cards: Vec<CardMeilisearch> = cards.into_iter().map(CardMeilisearch::from).collect();
        let t = index.add_documents(&cards, Some("card_number")).await?;
        Ok(t)
    }

    pub async fn search_cards(
        &self,
        query: String,
        page: PaginationOptions,
    ) -> Result<Vec<CardMeilisearch>, Error> {
        let index = self.client.index("cards");
        let response = index
            .search()
            .with_query(&query)
            .with_limit(page.get_max_results())
            .with_offset(page.get_page() * page.get_max_results())
            .execute::<CardMeilisearch>()
            .await?;
        Ok(response.hits.into_iter().map(|h| h.result).collect())
    }
}
