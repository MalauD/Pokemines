use actix_web::{web, HttpResponse};
use bson::oid::ObjectId;
use std::collections::HashMap;

use crate::{
    db::get_mongo,
    models::{Card, PopulatedTransaction, PopulatedTransactionType, User},
    tools::CardError,
};

use super::responses::CardResponse;

pub async fn get_marketplace_transactions(_: User) -> CardResponse {
    let db = get_mongo(None).await;
    let transactions = db.get_waiting_transaction_marketplace().await?;
    let card_ids = transactions
        .iter()
        .map(|t| t.transaction_type.as_marketplace().unwrap().1.clone())
        .collect::<Vec<_>>();

    let cards: HashMap<ObjectId, Card> = db
        .get_cards_from_ids(card_ids)
        .await?
        .into_iter()
        .map(|c| (c.id.unwrap(), c))
        .collect();
    let populated = transactions
        .into_iter()
        .map(|t| {
            let sender_card = cards
                .get(&t.transaction_type.as_marketplace().unwrap().1)
                .unwrap();
            let populated_transaction_type = PopulatedTransactionType::from_transaction_type(
                &t.transaction_type,
                vec![sender_card.clone()],
                vec![],
            );
            PopulatedTransaction::from_transaction(t, populated_transaction_type)
        })
        .collect::<Vec<_>>();

    Ok(HttpResponse::Ok().json(populated))
}

pub async fn get_transaction_by_id(req: web::Path<String>, _: User) -> CardResponse {
    let db = get_mongo(None).await;
    let oid = ObjectId::parse_str(req.into_inner())?;
    let transaction = db
        .get_transaction_by_id(&oid)
        .await?
        .ok_or(CardError::NotFound)?;
    let sender_card_ids = transaction.get_sender_card_ids();
    let sender_cards = db.get_cards_from_ids(sender_card_ids).await?;
    let receiver_card_ids = transaction.get_receiver_card_ids();
    let receiver_cards = db.get_cards_from_ids(receiver_card_ids).await?;

    let populated_transaction_type = PopulatedTransactionType::from_transaction_type(
        &transaction.transaction_type,
        sender_cards,
        receiver_cards,
    );
    let pop_transaction =
        PopulatedTransaction::from_transaction(transaction, populated_transaction_type);

    Ok(HttpResponse::Ok().json(pop_transaction))
}
