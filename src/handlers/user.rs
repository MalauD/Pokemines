use actix_web::HttpResponse;

use crate::models::{PublicUser, User};

use super::responses::UserResponse;

pub async fn me(user: User) -> UserResponse {
    Ok(HttpResponse::Ok().json(PublicUser::from(user)))
}
