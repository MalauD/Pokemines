use once_cell::sync::OnceCell;
use serde::Deserialize;
use tokio::sync::Mutex;

fn default_s3_region() -> String {
    "".to_string()
}

#[derive(Deserialize, Debug, Clone)]
pub struct AppSettings {
    pub admin_password: String,
    pub s3_url: String,
    #[serde(default = "default_s3_region")]
    pub s3_region: String,
    #[serde(default)]
    pub s3_bucket: String,
    pub mongo_url: String,
    pub session_key: Option<String>,
}

static APP_SETTINGS: OnceCell<AppSettings> = OnceCell::new();
static APP_SETTINGS_INITIALIZED: OnceCell<Mutex<bool>> = OnceCell::new();

pub async fn get_settings(base_settings: Option<AppSettings>) -> &'static AppSettings {
    if let Some(c) = APP_SETTINGS.get() {
        return c;
    }
    let initializing_mutex =
        APP_SETTINGS_INITIALIZED.get_or_init(|| tokio::sync::Mutex::new(false));

    let mut initialized = initializing_mutex.lock().await;

    if !*initialized && APP_SETTINGS.set(base_settings.unwrap()).is_ok() {
        *initialized = true;
    }
    drop(initialized);
    APP_SETTINGS.get().unwrap()
}

pub fn get_settings_sync() -> &'static AppSettings {
    APP_SETTINGS.get().unwrap()
}
