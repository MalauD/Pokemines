use std::{borrow::Borrow, collections::HashMap, num::NonZeroU32};

use actix_multipart::form::MultipartForm;
use actix_web::{web, HttpResponse};
use bson::oid::ObjectId;
use serde::Deserialize;
use serde_json::json;

use crate::{
    db::get_mongo,
    models::{BoostersSettings, Card, CardRarityPoints, CardReq, CardsRarityPoints, User},
    s3::get_s3,
    search::get_meilisearch,
    tools::{resize_image, CardError, PaginationOptions},
};

use super::responses::CardResponse;

pub async fn upload_card(mut card_form: MultipartForm<CardReq>, user: User) -> CardResponse {
    if !user.admin {
        return Err(CardError::Unauthorized);
    }

    let db = get_mongo(None).await;
    let s3 = get_s3(None).await;
    let meilisearch = get_meilisearch(None).await;

    let image_file = &mut card_form.image;
    let resized_image = resize_image(image_file.file.path(), NonZeroU32::new(500).unwrap());
    // Remove tmp file
    std::fs::remove_file(image_file.file.path()).unwrap();

    let card_number = db.get_last_card_number().await? + 1;
    let number_of_card = card_form.card_count.0;
    let price = card_form.price.0;
    let card_in_marketplace = card_form.card_in_marketplace.0;

    let card = Card::from_req(
        card_form.into_inner(),
        card_number,
        user.get_id().unwrap().clone(),
    );
    let card_ids = db.save_cards(&card, number_of_card).await?;
    s3.get_bucket()
        .put_object_with_content_type(
            format!("cards/{}.webp", card_number),
            &resized_image,
            "image/webp",
        )
        .await?;

    meilisearch.index_cards(vec![card]).await?;

    if card_in_marketplace {
        db.put_cards_in_marketplace(card_ids.clone(), price, user.get_id().unwrap().clone())
            .await?;
    }

    Ok(HttpResponse::Ok().json(json!({ "ids": card_ids, "card_number": card_number })))
}

#[derive(Deserialize)]
pub struct LimitQuery {
    limit: Option<usize>,
}

pub async fn get_last_created_cards(_: User, query: web::Query<LimitQuery>) -> CardResponse {
    let db = get_mongo(None).await;
    let limit = query.limit.unwrap_or(10);
    let cards = db.get_last_created_cards(limit).await?;
    Ok(HttpResponse::Ok().json(cards))
}

pub async fn get_cards_of_user(req: web::Path<String>, _: User) -> CardResponse {
    let db = get_mongo(None).await;
    let oid = ObjectId::parse_str(req.into_inner())?;
    let cards = db.get_card_of_user_grouped(&oid).await?;
    Ok(HttpResponse::Ok().json(cards))
}

pub async fn get_cards_by_number(req: web::Path<u32>, _: User) -> CardResponse {
    let db = get_mongo(None).await;
    let cards = db.get_card_by_number(req.into_inner()).await?;
    Ok(HttpResponse::Ok().json(cards))
}

pub async fn get_card_image(req: web::Path<String>) -> CardResponse {
    let s3 = get_s3(None).await;

    let mut custom_headers = HashMap::new();
    custom_headers.insert("content-type".to_string(), "image/webp".to_string());

    let presigned_url = s3
        .get_bucket()
        .presign_get(
            format!("cards/{}.webp", req.into_inner()),
            7200,
            Some(custom_headers),
        )
        .unwrap();

    Ok(HttpResponse::TemporaryRedirect()
        .content_type("image/webp")
        .append_header(("Cache-Control", "max-age=7100"))
        .append_header(("Location", presigned_url))
        .finish())
}

#[derive(Deserialize)]
pub struct SearchQuery {
    q: String,
}

pub async fn search_card(
    _: User,
    query: web::Query<SearchQuery>,
    pagination: web::Query<PaginationOptions>,
) -> CardResponse {
    let meilisearch = get_meilisearch(None).await;
    let cards = meilisearch
        .search_cards(query.into_inner().q, pagination.into_inner())
        .await?;
    Ok(HttpResponse::Ok().json(cards))
}

pub async fn get_boosters(_: User, boosters_settings: web::Data<BoostersSettings>) -> CardResponse {
    Ok(HttpResponse::Ok().json(boosters_settings))
}

pub async fn pay_booster(
    req: web::Path<u32>,
    user: User,
    boosters_settings: web::Data<BoostersSettings>,
    cards_points: web::Data<CardsRarityPoints>,
) -> CardResponse {
    let db = get_mongo(None).await;
    let boosters_settings = boosters_settings.get_ref();
    let BoostersSettings(boosters_settings) = boosters_settings;
    let booster = boosters_settings
        .get(req.into_inner() as usize)
        .ok_or(CardError::NotFound)?;

    // Verify that user has enough money
    let user = db.get_user(&user.get_id().unwrap()).await?.unwrap();
    let user_id = user.get_id().unwrap();
    if user.account_balance < booster.price {
        return Err(CardError::InsufficientFunds);
    }

    // Get card selection
    let settings = booster.get_card_selection_rand();
    log::debug!("Selected settings: {:?}", settings);
    let admin_id = db.get_admin().await?.get_id().unwrap();
    let admin_selling_card_ids = db.get_user_selling_cards(&admin_id).await?;
    let cards = db
        .get_random_cards_with_settings(
            &admin_id,
            &settings,
            &cards_points,
            &admin_selling_card_ids,
        )
        .await?
        .ok_or(CardError::NotEnoughCards)?;

    // Pay the booster
    db.transfer_money(&user_id, &admin_id, booster.price as i32)
        .await?;
    // Transfer cards
    let card_ids = cards.iter().map(|c| c.id.unwrap()).collect();
    db.transfer_cards(&card_ids, &admin_id, &user_id).await?;

    Ok(HttpResponse::Ok().json(cards))
}
