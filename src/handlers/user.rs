use actix_web::{web, HttpResponse};
use bson::oid::ObjectId;
use serde::Deserialize;

use crate::{
    db::get_mongo,
    models::{PublicUser, User},
    search::get_meilisearch,
    tools::PaginationOptions,
};

use super::responses::UserResponse;

pub async fn me(user: User) -> UserResponse {
    Ok(HttpResponse::Ok().json(PublicUser::from(user)))
}

pub async fn get_user(user_id: web::Path<String>, _: User) -> UserResponse {
    let db = get_mongo(None).await;
    let oid = ObjectId::parse_str(user_id.into_inner())?;
    let user = db.get_user(&oid).await?.ok_or("User not found");
    match user {
        Ok(user) => Ok(HttpResponse::Ok().json(PublicUser::from(user))),
        Err(e) => Ok(HttpResponse::NotFound().json(e.to_string())),
    }
}

#[derive(Deserialize)]
pub struct SearchQuery {
    q: String,
}

pub async fn search_user(
    _: User,
    query: web::Query<SearchQuery>,
    pagination: web::Query<PaginationOptions>,
) -> UserResponse {
    let meilisearch = get_meilisearch(None).await;
    let users = meilisearch
        .search_users(query.into_inner().q, pagination.into_inner())
        .await?;
    Ok(HttpResponse::Ok().json(users))
}
