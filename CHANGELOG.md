# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.2] - 2026-07-06

### Changed

- Align the template Rust workflow with the stable toolchain and move `rustfmt` and `clippy` components into `rust-toolchain.toml`.
- Update the template release workflow to use `tauri-apps/tauri-action@v1`, support manual unreleased draft builds, and set a stable release asset name pattern.
- Update root, template npm, and Tauri dependencies.

## [0.1.1] - 2026-07-02

### Added

- Create a GitHub release from the publish workflow after npm publishing succeeds.

### Changed

- Use the dedicated `macos-15-intel` runner for macOS x86_64 release builds.
- Remove explicit macOS target arguments from the release workflow now that each macOS build uses its own runner.

[unreleased]: https://github.com/duonghieu0712z/create-tauri-vue-template/compare/v0.1.2...HEAD
[0.1.2]: https://github.com/duonghieu0712z/create-tauri-vue-template/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/duonghieu0712z/create-tauri-vue-template/compare/v0.1.0...v0.1.1
