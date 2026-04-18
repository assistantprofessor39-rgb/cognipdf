#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde::{Deserialize, Serialize};
use tauri::Manager;

#[derive(Serialize, Deserialize)]
struct Answer { text: String }

#[tauri::command]
async fn index_pdf(path: String) -> Result<String, String> {
    Ok(format!("Indexed: {}", path))
}

#[tauri::command]
async fn ask(question: String) -> Result<Answer, String> {
    Ok(Answer { text: format!("V0.1 ready. You asked: '{}'. Next update makes me actually read PDFs.", question) })
}

fn main() {
    tauri::Builder::default()
      .plugin(tauri_plugin_dialog::init())
      .plugin(tauri_plugin_fs::init())
      .invoke_handler(tauri::generate_handler![index_pdf, ask])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
