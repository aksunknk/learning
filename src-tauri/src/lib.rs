mod db;

use db::{
    add_log as db_add_log, ensure_table, get_logs as db_get_logs, init_pool, ReadingLog, DB_URI,
};
use sqlx::{Pool, Sqlite};
use tauri::{Manager, State};
use tauri_plugin_sql::{Migration, MigrationKind};

struct DbState(Pool<Sqlite>);

#[tauri::command]
async fn get_logs(state: State<'_, DbState>) -> Result<Vec<ReadingLog>, String> {
    db_get_logs(&state.0).await
}

#[tauri::command]
async fn add_log(title: String, state: State<'_, DbState>) -> Result<ReadingLog, String> {
    db_add_log(&state.0, title).await
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![Migration {
        version: 1,
        description: "create_reading_logs",
        sql: "CREATE TABLE IF NOT EXISTS reading_logs (
            id TEXT PRIMARY KEY,
            isbn TEXT,
            title TEXT NOT NULL,
            author TEXT,
            status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'reading', 'read')),
            resonance INTEGER NOT NULL DEFAULT 0,
            updated_at TEXT NOT NULL
        )",
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations(DB_URI, migrations)
                .build(),
        )
        .setup(|app| {
            let handle = app.handle().clone();
            tauri::async_runtime::block_on(async move {
                let pool = init_pool(&handle).await?;
                ensure_table(&pool).await?;
                handle.manage(DbState(pool));
                Ok::<(), String>(())
            })
            .map_err(|e| -> Box<dyn std::error::Error> { e.into() })?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_logs, add_log])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
