use actix_web::HttpResponse;

use crate::tools::{CardError, UserError};

pub type UserResponse = Result<HttpResponse, UserError>;

pub type CardResponse = Result<HttpResponse, CardError>;
