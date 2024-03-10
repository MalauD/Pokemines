use crate::{
    api::config_api,
    app_settings::{get_settings, AppSettings},
    db::get_mongo,
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
use dotenv::dotenv;
use log::info;

mod api;
mod app_settings;
mod db;
mod handlers;
mod models;
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
            .route("/", web::get().to(index)) // Redirect all react routes to index
            .route("/Connexion", web::get().to(index))
            .route("/Accueil", web::get().to(index))
            .route("/Mon Compte", web::get().to(index))
            .route("/health", web::get().to(health))
            .configure(config_api)
            .service(Files::new("/", "./static"))
    })
    .bind(format!("0.0.0.0:{}", PORT))?
    .run()
    .await
}
