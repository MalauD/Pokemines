use actix_web::{web, HttpResponse};
use bson::oid::ObjectId;
use serde::Deserialize;
use std::collections::HashMap;

use crate::{
    db::get_mongo,
    models::{Card, PopulatedTransaction, PopulatedTransactionType, TransactionStatus, User},
    tools::CardError,
};

use super::responses::CardResponse;

pub async fn get_marketplace_transactions(_: User) -> CardResponse {
    let db = get_mongo(None).await;
    let transactions = db.get_waiting_transaction_marketplace_grouped().await?;
    Ok(HttpResponse::Ok().json(transactions))
}

pub async fn get_transaction_by_id(req: web::Path<String>, _: User) -> CardResponse {
    let db = get_mongo(None).await;
    let oid = ObjectId::parse_str(req.into_inner())?;
    let transaction = db
        .get_transaction_by_id(&oid)
        .await?
        .ok_or(CardError::NotFound)?;
    Ok(HttpResponse::Ok().json(transaction))
}

#[derive(Debug, Deserialize)]
pub struct TransactionQueryStatus {
    #[serde(rename = "status")]
    transaction_status: Option<TransactionStatus>,
}

pub async fn get_transaction_by_number(
    req: web::Path<u32>,
    _: User,
    query: web::Query<TransactionQueryStatus>,
) -> CardResponse {
    let db = get_mongo(None).await;
    let transaction = db
        .get_transactions_by_number(req.into_inner(), query.into_inner().transaction_status)
        .await?;
    Ok(HttpResponse::Ok().json(transaction))
}

pub async fn transaction_pay(user: User, req: web::Path<String>) -> CardResponse {
    let db = get_mongo(None).await;
    let tid = ObjectId::parse_str(req.into_inner())?;
    let transaction = db
        .get_transaction_by_id(&tid)
        .await?
        .ok_or(CardError::NotFound)?;

    if transaction.sender_id == user.get_id().unwrap()
        || transaction.status != TransactionStatus::Waiting
    {
        return Err(CardError::Unauthorized);
    }

    // Verify that user has enough money
    match transaction.transaction_type {
        PopulatedTransactionType::Marketplace { price, sender_card } => {
            let receiver_id = user.get_id().unwrap();
            if price > user.account_balance {
                return Err(CardError::InsufficientFunds);
            }
            db.transfer_card(
                &sender_card.id.unwrap(),
                &transaction.sender_id,
                &receiver_id,
            )
            .await?;
            db.transfer_money(&receiver_id, &transaction.sender_id, price as i32)
                .await?;
            db.complete_marketplace_transaction(&tid, &receiver_id)
                .await?;
            let transaction = db
                .get_transaction_by_id(&tid)
                .await?
                .ok_or(CardError::NotFound)?;
            Ok(HttpResponse::Ok().json(transaction))
        }
        PopulatedTransactionType::Transfer {
            sender_cards: _,
            receiver_cards: _,
        } => Ok(HttpResponse::MethodNotAllowed().body("Not implemented")),
    }
}

#[derive(Debug, Deserialize)]
pub struct SellRequest {
    card_ids: Vec<String>,
    price: u32,
}

pub async fn sell_cards(user: User, req: web::Json<SellRequest>) -> CardResponse {
    let db = get_mongo(None).await;
    let price = req.price;
    let card_ids: Vec<ObjectId> = req
        .into_inner()
        .card_ids
        .into_iter()
        .map(|x| ObjectId::parse_str(x).unwrap())
        .collect();
    if db.user_already_selling_cards(card_ids.clone()).await? {
        return Err(CardError::CardAlreadyInMarketplace);
    }
    let transactions = db
        .put_cards_in_marketplace(card_ids, price, user.get_id().unwrap())
        .await?;
    let transactions = db.get_transactions_by_ids(transactions).await?;
    Ok(HttpResponse::Ok().json(transactions))
}

pub async fn transaction_cancel(user: User, req: web::Path<String>) -> CardResponse {
    let db = get_mongo(None).await;
    let tid = ObjectId::parse_str(req.into_inner())?;
    let transaction = db
        .get_transaction_by_id(&tid)
        .await?
        .ok_or(CardError::NotFound)?;

    if transaction.sender_id != user.get_id().unwrap()
        || transaction.status != TransactionStatus::Waiting
    {
        return Err(CardError::Unauthorized);
    }

    db.cancel_transaction(&tid).await?;
    let transaction = db
        .get_transaction_by_id(&tid)
        .await?
        .ok_or(CardError::NotFound)?;
    Ok(HttpResponse::Ok().json(transaction))
}
