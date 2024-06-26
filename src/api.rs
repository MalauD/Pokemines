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
            .service(
                web::scope("/user")
                    .service(web::resource("/me").route(web::get().to(me)))
                    .service(web::resource("/search").route(web::get().to(search_user)))
                    .service(web::resource("/leaderboard").route(web::get().to(leaderboard)))
                    .service(web::resource("/all/donate").route(web::post().to(donate_to_all)))
                    .service(web::resource("/{id}").route(web::get().to(get_user)))
                    .service(web::resource("/{id}/cards").route(web::get().to(get_cards_of_user)))
                    .service(web::resource("/{id}/transfer").route(web::post().to(transfer_cards)))
                    .service(web::resource("/{id}/donate").route(web::post().to(donate_to_user))),
            )
            .service(
                web::scope("/card")
                    .service(web::resource("/latest").route(web::get().to(get_last_created_cards)))
                    .service(web::resource("/upload").route(web::post().to(upload_card)))
                    .service(
                        web::resource("/number/{card_number}")
                            .route(web::get().to(get_cards_by_number)),
                    )
                    .service(
                        web::resource("/number/{card_number}/image")
                            .route(web::get().to(get_card_image)),
                    )
                    .service(web::resource("/search").route(web::get().to(search_card)))
                    .service(
                        web::scope("/booster")
                            .service(web::resource("/all").route(web::get().to(get_boosters)))
                            .service(
                                web::resource("/{booster_number}/pay")
                                    .route(web::post().to(pay_booster)),
                            ),
                    ),
            )
            .service(
                web::scope("/transaction")
                    .service(
                        web::resource("/marketplace")
                            .route(web::get().to(get_marketplace_transactions)),
                    )
                    .service(web::resource("/id/{id}").route(web::get().to(get_transaction_by_id)))
                    .service(web::resource("/id/{id}/pay").route(web::post().to(transaction_pay)))
                    .service(
                        web::resource("/id/{id}/cancel").route(web::post().to(transaction_cancel)),
                    )
                    .service(
                        web::resource("/number/{number}")
                            .route(web::get().to(get_transaction_by_number)),
                    )
                    .service(web::resource("/sell").route(web::post().to(sell_cards)))
                    .service(
                        web::resource("/cancel").route(web::post().to(transaction_cancel_bulk)),
                    ),
            ),
    );
}
