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

#[derive(Deserialize)]
pub struct LeaderboardQuery {
    pub limit: Option<u32>,
}

pub async fn leaderboard(query: web::Query<LeaderboardQuery>) -> UserResponse {
    let db = get_mongo(None).await;
    let leaderboard = db.get_leaderboard(query.limit.unwrap_or(100)).await?;
    Ok(HttpResponse::Ok().json(leaderboard))
}

#[derive(Deserialize)]
pub struct Donation {
    amount: i32,
}

pub async fn donate_to_user(
    user: User,
    to_user_id: web::Path<String>,
    donation: web::Json<Donation>,
) -> UserResponse {
    if !user.admin {
        return Ok(HttpResponse::Forbidden().json("You are not allowed to donate"));
    }
    let db = get_mongo(None).await;
    let oid = ObjectId::parse_str(to_user_id.into_inner()).unwrap();
    let user = db.get_user(&oid).await.unwrap().unwrap();
    db.modify_account_balance(&oid, donation.amount).await?;

    Ok(HttpResponse::Ok().finish())
}

#[derive(Deserialize)]
pub struct TransferCard {
    card_id: String,
}

pub async fn transfer_card(
    user: User,
    to_user_id: web::Path<String>,
    card_id: web::Json<TransferCard>,
) -> UserResponse {
    if !user.admin {
        return Ok(HttpResponse::Forbidden().json("You are not allowed to donate"));
    }
    let db = get_mongo(None).await;
    let card_oid = ObjectId::parse_str(card_id.into_inner().card_id).unwrap();
    let to_user_oid = ObjectId::parse_str(to_user_id.into_inner()).unwrap();
    if db.user_already_selling_card(&card_oid).await? {
        return Ok(HttpResponse::BadRequest().json("Card is already in the marketplace"));
    }
    db.transfer_card(&card_oid, &user.get_id().unwrap(), &to_user_oid)
        .await?;
    Ok(HttpResponse::Ok().finish())
}
