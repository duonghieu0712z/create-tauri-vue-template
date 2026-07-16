# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Replace Dependabot with Renovate for dependency update automation, including grouped minor and patch updates for npm, Cargo, and GitHub Actions.
- Add a frontend build step to the template code quality workflow.
- Update the template release workflow matrix naming and use the macOS 26 Intel runner for x86_64 builds.
- Align template Rust lint-staged formatting with the stable Cargo toolchain.
- Update template npm dependencies and lockfile.

### Removed

- Remove the template `scrollbar` CSS utility.

## [0.1.3] - 2026-07-08

### Changed

- Improve the template release notes generation for manual draft builds and use explicit release asset platform names.

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

[unreleased]: https://github.com/duonghieu0712z/create-tauri-vue-template/compare/v0.1.3...HEAD
[0.1.3]: https://github.com/duonghieu0712z/create-tauri-vue-template/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/duonghieu0712z/create-tauri-vue-template/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/duonghieu0712z/create-tauri-vue-template/compare/v0.1.0...v0.1.1
