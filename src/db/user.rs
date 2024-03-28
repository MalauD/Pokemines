use crate::{
    db::MongoClient,
    models::{LeaderboardUser, PublicUser, User},
};
use bson::oid::ObjectId;
use futures::{StreamExt, TryStreamExt};
use mongodb::{bson::doc, error::Result};

impl MongoClient {
    pub async fn get_user_by_mail(&self, mail: &str) -> Result<Option<User>> {
        let coll = self._database.collection::<User>("User");
        coll.find_one(
            doc! {
                "mail": mail
            },
            None,
        )
        .await
    }

    pub async fn get_admin(&self) -> Result<User> {
        let coll = self._database.collection::<User>("User");
        coll.find_one(
            doc! {
                "admin": true,
                "mail": "admin"
            },
            None,
        )
        .await
        .map(|x| x.unwrap())
    }

    pub async fn get_user(&self, user: &ObjectId) -> Result<Option<User>> {
        let coll = self._database.collection::<User>("User");
        coll.find_one(doc! {"_id": user}, None).await
    }

    pub async fn save_user(&self, user: &User) -> Result<ObjectId> {
        let coll = self._database.collection::<User>("User");
        let res = coll.insert_one(user, None).await?;
        Ok(res.inserted_id.as_object_id().unwrap())
    }

    pub async fn has_user_by_mail(&self, mail: &str) -> Result<bool> {
        let coll = self._database.collection::<User>("User");
        coll.count_documents(doc! {"mail": mail}, None)
            .await
            .map(|c| c != 0)
    }

    pub async fn change_credentials(&self, user: &User) -> Result<()> {
        let coll = self._database.collection::<User>("User");
        coll.update_one(
            doc! {"_id": user.get_id().clone()},
            doc! {"$set": {"credential": user.credential.clone()}},
            None,
        )
        .await?;
        Ok(())
    }

    pub async fn append_card(&self, user_id: &ObjectId, card: &ObjectId) -> Result<()> {
        let coll = self._database.collection::<User>("User");
        coll.update_one(doc! {"_id": user_id}, doc! {"$push": {"cards": card}}, None)
            .await?;
        Ok(())
    }

    pub async fn modify_account_balance(&self, user_id: &ObjectId, amount: i32) -> Result<()> {
        let coll = self._database.collection::<User>("User");
        coll.update_one(
            doc! {"_id": user_id},
            doc! {"$inc": {"account_balance": amount}},
            None,
        )
        .await?;
        Ok(())
    }

    pub async fn transfer_money(
        &self,
        sender_id: &ObjectId,
        receiver_id: &ObjectId,
        amount: i32,
    ) -> Result<()> {
        let coll = self._database.collection::<User>("User");
        coll.update_one(
            doc! {"_id": receiver_id},
            doc! {"$inc": {"account_balance": amount}},
            None,
        )
        .await?;
        coll.update_one(
            doc! {"_id": sender_id},
            doc! {"$inc": {"account_balance": -amount as i32}},
            None,
        )
        .await?;
        Ok(())
    }

    pub async fn get_leaderboard(&self, limit: u32) -> Result<Vec<LeaderboardUser>> {
        let coll = self._database.collection::<User>("User");
        let pipeline = vec![
            doc! {
                "$lookup": {
                    "from": "Card",
                    "localField": "cards",
                    "foreignField": "_id",
                    "as": "cards_pop"
                }
            },
            doc! {
                "$addFields": {
                    "total_points": {
                        "$sum": "$cards_pop.points"
                    }
                }
            },
            doc! {
                "$setWindowFields": {
                    "sortBy": {"total_points": -1},
                    "output": {
                        "rank": {
                            "$rank": {},
                        },
                    }
                }
            },
            doc! {"$limit": limit},
        ];
        let cursor = coll.aggregate(pipeline, None).await?;
        Ok(cursor
            .map(|x| bson::from_document(x.unwrap()))
            .try_collect::<Vec<LeaderboardUser>>()
            .await?)
    }

    pub async fn get_leaderboard_user(&self, user: &ObjectId) -> Result<Option<LeaderboardUser>> {
        let coll = self._database.collection::<User>("User");
        let pipeline = vec![
            doc! {
                "$lookup": {
                    "from": "Card",
                    "localField": "cards",
                    "foreignField": "_id",
                    "as": "cards_pop"
                }
            },
            doc! {
                "$addFields": {
                    "total_points": {
                        "$sum": "$cards_pop.points"
                    }
                }
            },
            doc! {
                "$setWindowFields": {
                    "sortBy": {"total_points": -1},
                    "output": {
                        "rank": {
                            "$rank": {},
                        },
                    }
                }
            },
            doc! {
                "$match": {
                    "_id": user
                }
            },
        ];
        let mut cursor = coll.aggregate(pipeline, None).await?;
        Ok(cursor
            .next()
            .await
            .map(|x| bson::from_document(x.unwrap()).unwrap()))
    }
}
