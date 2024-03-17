use actix_multipart::form::MultipartForm;
use actix_web::{web, HttpResponse};
use bson::oid::ObjectId;
use serde_json::json;

use crate::{
    db::get_mongo,
    models::{Card, CardReq, User},
    s3::get_s3,
    tools::CardError,
};

use super::responses::CardResponse;

pub async fn upload_card(mut card_form: MultipartForm<CardReq>, user: User) -> CardResponse {
    if !user.admin {
        return Err(CardError::Unauthorized);
    }

    let db = get_mongo(None).await;
    let s3 = get_s3(None).await;

    let image_file = &mut card_form.image;
    let file = image_file.file.as_file_mut();
    let mut async_file = tokio::fs::File::from_std(file.try_clone().unwrap());

    let card_number = db.get_last_card_number().await? + 1;
    let number_of_card = card_form.card_count.0;
    let price = card_form.price.0;

    let card = Card::from_req(card_form.into_inner(), card_number);
    let card_ids = db.save_cards(&card, number_of_card).await?;
    s3.get_bucket()
        .put_object_stream(&mut async_file, format!("cards/{}", card_number))
        .await?;

    // Put objects in marketplace
    db.put_cards_in_marketplace(card_ids.clone(), price, user.get_id().unwrap().clone())
        .await?;

    Ok(HttpResponse::Ok().json(json!({ "ids": card_ids })))
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
    let image = s3
        .get_bucket()
        .get_object(format!("cards/{}", req.into_inner()))
        .await?;

    Ok(HttpResponse::Ok()
        .content_type("image/png")
        .body(image.to_vec()))
}
