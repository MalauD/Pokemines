use actix_identity::Identity;
use actix_web::{web, HttpMessage, HttpRequest, HttpResponse};
use serde::Deserialize;
use serde_json::json;

use crate::{
    db::get_mongo,
    models::{CreateUserReq, User, UserReq},
    search::{get_meilisearch, UserMeilisearch},
    tools::UserError,
};

use super::responses::UserResponse;

pub async fn login(request: HttpRequest, user: web::Json<UserReq>) -> UserResponse {
    let db = get_mongo(None).await;
    if let Some(user_mod) = db.get_user_by_mail(&user.mail).await? {
        user_mod.login(&user)?;
        Identity::login(
            &request.extensions(),
            user_mod.get_id().unwrap().to_string(),
        )
        .map_err(|_| UserError::AuthenticationError)?;

        Ok(HttpResponse::Ok().finish())
    } else {
        Ok(HttpResponse::Forbidden().finish())
    }
}

#[derive(Deserialize)]
pub struct ChangePasswordReq {
    pub password: String,
    pub new_password: String,
}

pub async fn change_password(
    new_password: web::Json<ChangePasswordReq>,
    user: User,
) -> UserResponse {
    let db = get_mongo(None).await;
    user.login(&UserReq {
        mail: user.mail.clone(),
        password: new_password.password.clone(),
    })?;
    let mut user = user.clone();
    user.set_password(&new_password.new_password)?;
    db.change_credentials(&user).await?;
    Ok(HttpResponse::Ok().finish())
}

pub async fn create_user(new_user: web::Json<CreateUserReq>, user: User) -> UserResponse {
    let db = get_mongo(None).await;
    let meilisearch = get_meilisearch(None).await;
    if !user.admin {
        return Ok(HttpResponse::Forbidden().finish());
    }
    let generated_password = User::generate_password();
    let mut user = User::from(new_user.into_inner());
    if db.has_user_by_mail(&user.mail).await? {
        return Ok(HttpResponse::Conflict().finish());
    }
    let id = db.save_user(&user).await?;
    user.set_id(id);
    meilisearch.index_users(vec![user]).await?;
    Ok(HttpResponse::Created().json(json!({ "id": id.to_hex(), "password": generated_password })))
}

pub async fn logout(id: Identity) -> UserResponse {
    Identity::logout(id);
    Ok(HttpResponse::Ok().finish())
}
