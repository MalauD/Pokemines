use crate::handlers::*;
use actix_web::web;

pub fn config_api(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .service(
                web::scope("/auth")
                    .service(web::resource("/login").route(web::post().to(login)))
                    .service(
                        web::resource("/change_password").route(web::post().to(change_password)),
                    )
                    .service(web::resource("/create_user").route(web::post().to(create_user)))
                    .service(web::resource("/logout").route(web::post().to(logout))),
            )
            .service(web::scope("/user").service(web::resource("/me").route(web::get().to(me)))),
    );
}
