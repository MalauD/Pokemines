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
            password: None,
            promo: None,
            admin: true,
            account_balance: 0,
        };
        let admin = crate::models::User::from_create_req(
            admin_create_user,
            get_settings_sync().admin_password.clone(),
        );
        MONGO.get().unwrap().save_user(&admin).await.unwrap();
        log::info!("Admin user created");
    }

    drop(initialized);
    MONGO.get().unwrap()
}
