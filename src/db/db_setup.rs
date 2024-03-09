use log::info;
use mongodb::{options::ClientOptions, Client, Database};
use once_cell::sync::OnceCell;
use serde::Deserialize;
use tokio::sync::Mutex;

use crate::app_settings::get_settings_sync;

static MONGO: OnceCell<MongoClient> = OnceCell::new();
static MONGO_INITIALIZED: OnceCell<Mutex<bool>> = OnceCell::new();

pub struct MongoClient {
    pub(in crate::db) _database: Database,
}

pub async fn get_mongo(mongo_url: Option<String>) -> &'static MongoClient {
    if let Some(c) = MONGO.get() {
        return c;
    }
    info!(target: "Pokemines::mongodb", "Connecting to database");
    let initializing_mutex = MONGO_INITIALIZED.get_or_init(|| tokio::sync::Mutex::new(false));

    let mut initialized = initializing_mutex.lock().await;

    if !*initialized {
        if let Ok(client_options) = ClientOptions::parse(mongo_url.unwrap()).await {
            if let Ok(client) = Client::with_options(client_options) {
                if MONGO
                    .set(MongoClient {
                        _database: client.database("Pokemines"),
                    })
                    .is_ok()
                {
                    *initialized = true;
                }
            }
        }
    }
    if !MONGO
        .get()
        .unwrap()
        .has_user_by_mail(&"admin")
        .await
        .unwrap()
    {
        let admin_create_user = crate::models::CreateUserReq {
            mail: "admin".to_string(),
            first_name: "admin".to_string(),
            last_name: "admin".to_string(),
            password: get_settings_sync().admin_password.clone(),
            promo: None,
        };
        let admin = crate::models::User::from(admin_create_user);
        MONGO.get().unwrap().save_user(admin).await.unwrap();
        log::info!("Admin user created");
    }

    drop(initialized);
    MONGO.get().unwrap()
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PaginationOptions {
    page: usize,
    max_results: u32,
}

impl PaginationOptions {
    pub fn get_page(&self) -> usize {
        self.page
    }
    pub fn get_max_results(&self) -> usize {
        self.max_results as usize
    }

    pub fn trim_vec<T: Copy>(&self, input: &[T]) -> Vec<T> {
        let rng = self.get_max_results() * self.get_page()
            ..self.get_max_results() * (self.get_page() + 1);
        let mut vec: Vec<T> = Vec::with_capacity(rng.len());
        for (i, e) in input.iter().enumerate() {
            if rng.contains(&i) {
                vec.push(*e);
            }
        }
        vec
    }
}
