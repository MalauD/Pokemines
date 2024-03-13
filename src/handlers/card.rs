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

    let card = Card::from_req(card_form.into_inner(), card_number);
    let card_id = db.save_cards(&card, number_of_card).await?;
    s3.get_bucket()
        .put_object_stream(&mut async_file, format!("cards/{}", card_number))
        .await?;

    Ok(HttpResponse::Ok().json(json!({ "ids": card_id })))
}

pub async fn get_card_of_user(req: web::Path<String>, _: User) -> CardResponse {
    let db = get_mongo(None).await;
    let oid = ObjectId::parse_str(req.into_inner())?;
    let cards = db.get_card_of_user(&oid).await?;
    Ok(HttpResponse::Ok().json(cards))
}
