use std::pin::Pin;

use actix_identity::Identity;
use actix_web::{dev::Payload, error::ErrorUnauthorized, Error, FromRequest, HttpRequest};
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use futures::Future;
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

use crate::{db::get_mongo, tools::UserError};

use super::serialize_option_oid_hex;

#[derive(Debug, Deserialize, Serialize, Clone, Copy)]
pub enum Promo {
    #[serde(rename = "NA")]
    PNA,
    #[serde(rename = "2A")]
    P2A,
    #[serde(rename = "3A")]
    P3A,
    #[serde(rename = "4A")]
    P4A,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct User {
    #[serde(
        rename = "_id",
        skip_serializing_if = "Option::is_none",
        serialize_with = "serialize_option_oid_hex"
    )]
    id: Option<ObjectId>,
    pub mail: String,
    pub first_name: String,
    pub last_name: String,
    pub credential: String,
    pub promo: Option<Promo>,
    pub admin: bool,
    pub cards: Vec<ObjectId>,
    pub account_balance: u32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PublicUser {
    #[serde(
        rename = "_id",
        skip_serializing_if = "Option::is_none",
        serialize_with = "serialize_option_oid_hex"
    )]
    id: Option<ObjectId>,
    pub mail: String,
    pub first_name: String,
    pub last_name: String,
    pub promo: Option<Promo>,
    pub admin: bool,
    pub cards: Vec<ObjectId>,
    pub account_balance: u32,
}

impl From<User> for PublicUser {
    fn from(user: User) -> Self {
        PublicUser {
            id: user.id,
            mail: user.mail,
            first_name: user.first_name,
            last_name: user.last_name,
            promo: user.promo,
            admin: user.admin,
            cards: user.cards,
            account_balance: user.account_balance,
        }
    }
}

#[derive(Deserialize)]
pub struct UserReq {
    pub mail: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct CreateUserReq {
    pub mail: String,
    pub first_name: String,
    pub last_name: String,
    pub password: Option<String>,
    pub account_balance: u32,
    pub promo: Option<Promo>,
}

impl User {
    pub fn from_create_req(req: CreateUserReq, password: String) -> Self {
        let argon2 = Argon2::default();
        let salt = SaltString::generate(&mut OsRng);

        let hash = argon2
            .hash_password(password.as_bytes(), &salt)
            .unwrap()
            .to_string();

        User {
            id: None,
            mail: req.mail,
            first_name: req.first_name,
            last_name: req.last_name,
            credential: hash,
            promo: req.promo,
            admin: false,
            cards: vec![],
            account_balance: req.account_balance,
        }
    }

    pub fn login(&self, user: &UserReq) -> Result<(), UserError> {
        let parsed_hash =
            PasswordHash::new(&self.credential).map_err(|_| UserError::AuthenticationError)?;
        let argon2 = Argon2::default();

        argon2
            .verify_password(user.password.as_bytes(), &parsed_hash)
            .map_err(|_| UserError::MismatchingCredential)
    }

    pub fn get_id(&self) -> Option<ObjectId> {
        self.id
    }

    pub fn set_id(&mut self, id: ObjectId) {
        self.id = Some(id);
    }

    pub fn set_password(&mut self, password: &str) -> Result<(), UserError> {
        let argon2 = Argon2::default();
        let salt = SaltString::generate(&mut OsRng);
        let hash = argon2
            .hash_password(password.as_bytes(), &salt)
            .map_err(|_| UserError::AuthenticationError)?;

        self.credential = hash.to_string();
        Ok(())
    }

    pub fn generate_password() -> String {
        rand::Rng::sample_iter(rand::thread_rng(), &rand::distributions::Alphanumeric)
            .take(14)
            .map(char::from)
            .collect()
    }
}

impl FromRequest for User {
    type Error = Error;
    type Future = Pin<Box<dyn Future<Output = Result<User, Error>>>>;

    fn from_request(req: &HttpRequest, pl: &mut Payload) -> Self::Future {
        let fut = Identity::from_request(req, pl);
        Box::pin(async move {
            let db = get_mongo(None).await;
            if let Ok(identity) = fut.await?.id() {
                if let Some(user) = db
                    .get_user(&ObjectId::parse_str(identity).unwrap())
                    .await
                    .unwrap()
                {
                    return Ok(user);
                }
            };

            Err(ErrorUnauthorized("unauthorized"))
        })
    }
}
