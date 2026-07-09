use chrono::Utc;
use serde::{Deserialize, Serialize};
use sqlx::{sqlite::SqlitePoolOptions, Pool, Sqlite};
use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use uuid::Uuid;

pub const DB_URI: &str = "sqlite:lemma.db";

pub fn db_path(app: &AppHandle) -> Result<PathBuf, String> {
    let config_dir = app.path().app_config_dir().map_err(|e| e.to_string())?;
    std::fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;
    Ok(config_dir.join("lemma.db"))
}

pub async fn init_pool(app: &AppHandle) -> Result<Pool<Sqlite>, String> {
    let path = db_path(app)?;
    let url = format!("sqlite:{}?mode=rwc", path.display());
    SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&url)
        .await
        .map_err(|e| e.to_string())
}

pub async fn ensure_table(pool: &Pool<Sqlite>) -> Result<(), String> {
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS reading_logs (
            id TEXT PRIMARY KEY,
            isbn TEXT,
            title TEXT NOT NULL,
            author TEXT,
            status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'reading', 'read')),
            resonance INTEGER NOT NULL DEFAULT 0,
            updated_at TEXT NOT NULL
        )",
    )
    .execute(pool)
    .await
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ReadingLog {
    pub id: String,
    pub isbn: Option<String>,
    pub title: String,
    pub author: Option<String>,
    pub status: String,
    pub resonance: bool,
    pub updated_at: String,
}

#[derive(Debug, sqlx::FromRow)]
struct ReadingLogRow {
    id: String,
    isbn: Option<String>,
    title: String,
    author: Option<String>,
    status: String,
    resonance: i64,
    updated_at: String,
}

impl From<ReadingLogRow> for ReadingLog {
    fn from(row: ReadingLogRow) -> Self {
        Self {
            id: row.id,
            isbn: row.isbn,
            title: row.title,
            author: row.author,
            status: row.status,
            resonance: row.resonance != 0,
            updated_at: row.updated_at,
        }
    }
}

pub async fn get_logs(pool: &Pool<Sqlite>) -> Result<Vec<ReadingLog>, String> {
    let rows = sqlx::query_as::<_, ReadingLogRow>(
        "SELECT id, isbn, title, author, status, resonance, updated_at
         FROM reading_logs
         ORDER BY updated_at DESC",
    )
    .fetch_all(pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(rows.into_iter().map(ReadingLog::from).collect())
}

pub async fn add_log(pool: &Pool<Sqlite>, title: String) -> Result<ReadingLog, String> {
    let id = Uuid::new_v4().to_string();
    let updated_at = Utc::now().to_rfc3339();
    let status = "unread".to_string();
    let resonance = false;

    sqlx::query(
        "INSERT INTO reading_logs (id, isbn, title, author, status, resonance, updated_at)
         VALUES (?, NULL, ?, NULL, ?, ?, ?)",
    )
    .bind(&id)
    .bind(&title)
    .bind(&status)
    .bind(resonance)
    .bind(&updated_at)
    .execute(pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(ReadingLog {
        id,
        isbn: None,
        title,
        author: None,
        status,
        resonance,
        updated_at,
    })
}
