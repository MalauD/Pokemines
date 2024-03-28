use crate::{
    api::config_api,
    app_settings::{get_settings, AppSettings},
    db::get_mongo,
    models::{BoostersSettings, CardsRarityPoints},
    s3::get_s3,
    search::{get_meilisearch, MeilisearchConfig},
};
use actix_files::{Files, NamedFile};
use actix_identity::IdentityMiddleware;
use actix_session::{
    config::{CookieContentSecurity, PersistentSession},
    storage::CookieSessionStore,
    SessionMiddleware,
};
use actix_web::{
    cookie::{time::Duration, Key},
    middleware, web, App, HttpRequest, HttpResponse, HttpServer, Result,
};
use bson::serde_helpers;
use dotenv::dotenv;
use log::info;

mod api;
mod app_settings;
mod db;
mod handlers;
mod models;
mod s3;
mod search;
mod tools;

async fn index(_req: HttpRequest) -> Result<NamedFile> {
    Ok(NamedFile::open("./static/index.html")?)
}

async fn health(_req: HttpRequest) -> Result<HttpResponse> {
    Ok(HttpResponse::Ok().body("It's alive!"))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let config: AppSettings = envy::from_env().unwrap();
    let _ = get_settings(Some(config.clone())).await;

    let secret_key = if let Some(key) = config.session_key.clone() {
        Key::from(key.as_bytes())
    } else {
        Key::generate()
    };

    env_logger::init();
    info!(target:"Pokemines::main","Starting Pokemines");
    const PORT: i32 = 8080;

    let _db = get_mongo(Some(config.mongo_url.clone())).await;

    let _ = get_meilisearch(Some(MeilisearchConfig::new(
        config.meilisearch_host.clone(),
        config.meilisearch_api_key.clone(),
    )))
    .await;

    let _ = get_s3(Some(s3::S3Config {
        s3_url: config.s3_url.clone(),
        s3_region: config.s3_region.clone(),
        s3_bucket: config.s3_bucket.clone(),
    }))
    .await;

    let card_config: CardsRarityPoints = serde_json::from_str(
        std::fs::read_to_string("./static/js/CardRarityPoints.json")
            .unwrap()
            .as_str(),
    )
    .unwrap();

    let boosters_config: BoostersSettings = serde_json::from_str(
        std::fs::read_to_string("./static/js/BoosterComposition.json")
            .unwrap()
            .as_str(),
    )
    .unwrap();

    HttpServer::new(move || {
        App::new()
            .wrap(middleware::Compress::default())
            .wrap(IdentityMiddleware::default())
            .wrap(
                SessionMiddleware::builder(CookieSessionStore::default(), secret_key.clone())
                    .cookie_secure(false)
                    .cookie_content_security(CookieContentSecurity::Private)
                    .cookie_name("pokemines-id".to_string())
                    .session_lifecycle(
                        PersistentSession::default()
                            .session_ttl(Duration::new(60 * 60 * 24 * 365, 0)),
                    )
                    .build(),
            )
            .app_data(web::Data::new(card_config.clone()))
            .app_data(web::Data::new(boosters_config.clone()))
            .route("/", web::get().to(index)) // Redirect all react routes to index
            .route("/connexion", web::get().to(index))
            .route("/connexion/{tail:.*}", web::get().to(index))
            .route("/moi", web::get().to(index))
            .route("/moi/{tail:.*}", web::get().to(index))
            .route("/changermdp", web::get().to(index))
            .route("/changermdp/{tail:.*}", web::get().to(index))
            .route("/utilisateur", web::get().to(index))
            .route("/utilisateur/{tail:.*}", web::get().to(index))
            .route("/admin", web::get().to(index))
            .route("/admin/{tail:.*}", web::get().to(index))
            .route("/marche", web::get().to(index))
            .route("/marche/{tail:.*}", web::get().to(index))
            .route("/explorer", web::get().to(index))
            .route("/explorer/{tail:.*}", web::get().to(index))
            .route("/pokedex", web::get().to(index))
            .route("/pokedex/{tail:.*}", web::get().to(index))
            .route("/leaderboard", web::get().to(index))
            .route("/transaction", web::get().to(index))
            .route("/transaction/{tail:.*}", web::get().to(index))
            .route("/carte", web::get().to(index))
            .route("/carte/{tail:.*}", web::get().to(index))
            .route("/booster", web::get().to(index))
            .route("/booster/{tail:.*}", web::get().to(index))
            .route("/health", web::get().to(health))
            .configure(config_api)
            .service(Files::new("/", "./static"))
    })
    .bind(format!("0.0.0.0:{}", PORT))?
    .run()
    .await
}
