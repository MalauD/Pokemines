use actix_web::{http::StatusCode, HttpResponse, HttpResponseBuilder, ResponseError};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum UserError {
    #[error("MismatchingCredential: cannot login")]
    MismatchingCredential,
    #[error("AuthenticationError: something went wrong with the authentication")]
    AuthenticationError,
    #[error("DatabaseError: something went wrong with mongodb")]
    DatabaseError(#[from] mongodb::error::Error),
    #[error("Bson: something went wrong with the deserialization")]
    Deserialization(#[from] bson::oid::Error),
    #[error("MeilisearchError: something went wrong with meilisearch")]
    MeilisearchError(#[from] meilisearch_sdk::errors::Error),
}

impl ResponseError for UserError {
    fn status_code(&self) -> StatusCode {
        match *self {
            Self::MismatchingCredential => StatusCode::UNAUTHORIZED,
            Self::AuthenticationError => StatusCode::INTERNAL_SERVER_ERROR,
            Self::DatabaseError(_) => StatusCode::INTERNAL_SERVER_ERROR,
            Self::Deserialization(_) => StatusCode::INTERNAL_SERVER_ERROR,
            Self::MeilisearchError(_) => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    fn error_response(&self) -> HttpResponse {
        HttpResponseBuilder::new(self.status_code()).finish()
    }
}

#[derive(Error, Debug)]
pub enum CardError {
    #[error("DatabaseError: something went wrong with mongodb")]
    DatabaseError(#[from] mongodb::error::Error),
    #[error("Unauthorized: you are not allowed to perform this action")]
    Unauthorized,
    #[error("S3Error: something went wrong with s3")]
    S3Error(#[from] s3::error::S3Error),
    #[error("Bson: something went wrong with the deserialization")]
    Deserialization(#[from] bson::oid::Error),
    #[error("Not Found")]
    NotFound,
    #[error("InsufficientFunds: you don't have enough money")]
    InsufficientFunds,
    #[error("CardAlreadyInMarketplace: you cannot add a card that is already in the marketplace")]
    CardAlreadyInMarketplace,
    #[error("MeilisearchError: something went wrong with meilisearch")]
    MeilisearchError(#[from] meilisearch_sdk::errors::Error),
    #[error("NotEnoughCards: not enough cards to create a booster")]
    NotEnoughCards,
}

impl ResponseError for CardError {
    fn status_code(&self) -> StatusCode {
        match *self {
            Self::DatabaseError(_) => StatusCode::INTERNAL_SERVER_ERROR,
            Self::Unauthorized => StatusCode::UNAUTHORIZED,
            Self::S3Error(_) => StatusCode::INTERNAL_SERVER_ERROR,
            Self::Deserialization(_) => StatusCode::INTERNAL_SERVER_ERROR,
            Self::NotFound => StatusCode::NOT_FOUND,
            Self::InsufficientFunds => StatusCode::FORBIDDEN,
            Self::CardAlreadyInMarketplace => StatusCode::FORBIDDEN,
            Self::MeilisearchError(_) => StatusCode::INTERNAL_SERVER_ERROR,
            Self::NotEnoughCards => StatusCode::FORBIDDEN,
        }
    }

    fn error_response(&self) -> HttpResponse {
        match self {
            Self::DatabaseError(_) => HttpResponseBuilder::new(self.status_code()).finish(),
            Self::S3Error(_) => HttpResponseBuilder::new(self.status_code()).finish(),
            Self::Deserialization(_) => HttpResponseBuilder::new(self.status_code()).finish(),
            Self::MeilisearchError(_) => HttpResponseBuilder::new(self.status_code()).finish(),
            _ => HttpResponseBuilder::new(self.status_code()).body(self.to_string()),
        }
    }
}
