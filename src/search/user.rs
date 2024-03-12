use bson::{oid::ObjectId, serde_helpers::serialize_object_id_as_hex_string};
use serde::{Deserialize, Serialize};

use meilisearch_sdk::{errors::Error, task_info::TaskInfo};

use crate::{
    models::{Promo, User},
    search::MeilisearchClient,
    tools::PaginationOptions,
};

pub fn deserialize_object_id_as_hex_string<'de, D>(deserializer: D) -> Result<ObjectId, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let s = String::deserialize(deserializer)?;
    Ok(ObjectId::parse_str(&s).map_err(serde::de::Error::custom)?)
}

#[derive(Serialize, Deserialize)]
pub struct UserMeilisearch {
    #[serde(
        serialize_with = "serialize_object_id_as_hex_string",
        deserialize_with = "deserialize_object_id_as_hex_string"
    )]
    pub id: ObjectId,
    pub first_name: String,
    pub last_name: String,
    pub promo: Option<Promo>,
}

impl From<User> for UserMeilisearch {
    fn from(user: User) -> Self {
        UserMeilisearch {
            id: user.get_id().unwrap(),
            first_name: user.first_name,
            last_name: user.last_name,
            promo: user.promo,
        }
    }
}

impl MeilisearchClient {
    pub async fn init_users_index(&self) -> Result<(), Error> {
        let index = self.client.index("users");
        let _ = index
            .set_searchable_attributes(&["first_name", "last_name"])
            .await?;
        let _ = index
            .set_ranking_rules(&[
                "words",
                "typo",
                "proximity",
                "attribute",
                "exactness",
                "sort",
            ])
            .await?;
        Ok(())
    }

    pub async fn index_users(&self, users: Vec<User>) -> Result<TaskInfo, Error> {
        let index = self.client.index("users");
        let users: Vec<UserMeilisearch> = users.into_iter().map(UserMeilisearch::from).collect();
        let t = index.add_documents(&users, Some("id")).await?;
        Ok(t)
    }

    pub async fn search_users(
        &self,
        query: String,
        page: PaginationOptions,
    ) -> Result<Vec<UserMeilisearch>, Error> {
        let index = self.client.index("users");
        let response = index
            .search()
            .with_query(&query)
            .with_limit(page.get_max_results())
            .with_offset(page.get_page() * page.get_max_results())
            .execute::<UserMeilisearch>()
            .await?;
        Ok(response.hits.into_iter().map(|h| h.result).collect())
    }
}
