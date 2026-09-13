mod command;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let specta_builder = tauri_specta::Builder::<tauri::Wry>::new().commands(command::commands());

    #[cfg(all(debug_assertions, not(mobile)))]
    {
        use specta_typescript::Typescript;

        if let Err(error) =
            specta_builder.export(Typescript::default(), "../src/generated/bindings.ts")
        {
            eprintln!("failed to export TypeScript bindings: {error}");
        }
    }

    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_prevent_default::debug());

    #[cfg(debug_assertions)]
    let builder = builder.plugin(tauri_plugin_devtools::init());

    #[cfg(not(debug_assertions))]
    let builder = builder.plugin(
        tauri_plugin_log::Builder::new()
            .level(log::LevelFilter::Info)
            .filter(|metadata| metadata.target().starts_with(env!("CARGO_CRATE_NAME")))
            .format(|out, message, record| {
                out.finish(format_args!(
                    "[{}]|{:<5}: {}",
                    chrono::Local::now().format("%Y-%m-%d %H:%M:%S"),
                    record.level(),
                    message
                ))
            })
            .build(),
    );

    let result = builder
        .invoke_handler(specta_builder.invoke_handler())
        .setup(|_app| {
            #[cfg(debug_assertions)]
            {
                use tauri::Manager;

                if let Some(window) = _app.get_webview_window("main") {
                    window.open_devtools();
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!());

    if let Err(error) = result {
        eprintln!("error while running Tauri application: {error}");
        std::process::exit(1);
    }
}
