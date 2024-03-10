use bson::oid::ObjectId;
use serde::Serializer;

pub fn serialize_option_oid_hex<S>(x: &Option<ObjectId>, s: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    match x {
        Some(o) => s.serialize_str(&o.to_hex()),
        None => s.serialize_none(),
    }
}
