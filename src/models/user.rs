use std::pin::Pin;

use actix_identity::Identity;
use actix_web::{dev::Payload, error::ErrorUnauthorized, Error, FromRequest, HttpRequest};
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use futures::Future;
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize, Serializer};

use crate::{db::get_mongo, tools::UserError};

#[derive(Debug, Deserialize, Serialize, Clone, Copy)]
pub enum Promo {
    PNA,
    P2A,
    P3A,
    P4A,
}

impl std::str::FromStr for Promo {
    type Err = ();

    fn from_str(s: &str) -> std::result::Result<Self, Self::Err> {
        match s {
            "NA" => Ok(Promo::PNA),
            "2A" => Ok(Promo::P2A),
            "3A" => Ok(Promo::P3A),
            "4A" => Ok(Promo::P4A),
            _ => Err(()),
        }
    }
}

impl Promo {
    pub fn to_string(&self) -> String {
        match self {
            Promo::PNA => "NA".to_string(),
            Promo::P2A => "2A".to_string(),
            Promo::P3A => "3A".to_string(),
            Promo::P4A => "4A".to_string(),
        }
    }
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
}

fn serialize_option_oid_hex<S>(x: &Option<ObjectId>, s: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    match x {
        Some(o) => s.serialize_str(&o.to_hex()),
        None => s.serialize_none(),
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
    pub password: String,
    pub promo: Option<Promo>,
}

impl User {
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

impl From<CreateUserReq> for User {
    fn from(req: CreateUserReq) -> Self {
        let argon2 = Argon2::default();
        let salt = SaltString::generate(&mut OsRng);

        let hash = argon2
            .hash_password(req.password.as_bytes(), &salt)
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
        }
    }
}
