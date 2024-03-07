use crate::handlers::*;
use actix_web::web;

pub fn config_api(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/api"));
}
