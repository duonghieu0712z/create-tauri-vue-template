export default {
    '*.{js,ts,tsx,vue,html,css,json,yml,yaml}': ['oxfmt'],
    '*.{js,ts,tsx,vue}': ['oxlint --fix', 'eslint --fix'],
    '*.rs': () => [
        'cargo fmt --manifest-path src-tauri/Cargo.toml',
        'cargo clippy --manifest-path src-tauri/Cargo.toml -- -D warnings',
    ],
};
