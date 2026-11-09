# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.4] - 2026-11-09

### Changed

- Updated CLI dependencies and tooling, including `cac`, `@commitlint/cli`, `@commitlint/config-conventional`, `@types/node`, `lint-staged`, and `oxlint` ([fd0b245](https://github.com/duonghieu0712z/create-tauri-vue-template/commit/fd0b2456054513a69b1649251d977ea0d34d696f)).
- Updated root and template package manager pins to `pnpm@12.18.0` and refreshed JavaScript lockfiles ([e22980f](https://github.com/duonghieu0712z/create-tauri-vue-template/commit/e22980f0fc3d1e783f326c81a40fd8deaba8696a)).
- Raised the generated template's minimum Node.js version from 22.12.0 to 22.18.0. Users on Node.js 22.12–22.17 must upgrade before running development, build, or preview commands, which now use Vite's native config loader ([d4ea9a0](https://github.com/duonghieu0712z/create-tauri-vue-template/commit/d4ea9a0b97c30a451e09be497fe8a13447641082)).
- Aligned the template's TypeScript tooling configuration with NodeNext and TypeScript import extensions, and simplified the Vite configuration to a plain object ([d4ea9a0](https://github.com/duonghieu0712z/create-tauri-vue-template/commit/d4ea9a0b97c30a451e09be497fe8a13447641082)).
- Updated template frontend dependencies and replaced the local `clsx` and `tailwind-merge` wrapper with a re-export from `cn` ([d4ea9a0](https://github.com/duonghieu0712z/create-tauri-vue-template/commit/d4ea9a0b97c30a451e09be497fe8a13447641082)).
- Updated template Rust dependencies, including `tauri` 2.12.5, `specta` and `tauri-specta` 2.0.0-rc.26, `specta-typescript` 0.0.13, and `tauri-plugin-prevent-default` 6.0.1 ([945d0e8](https://github.com/duonghieu0712z/create-tauri-vue-template/commit/945d0e8ff2a9c0ca49a093c335dab31c905e9dba)).
- Grouped the template's Tauri npm and Cargo dependency updates into one weekly Dependabot pull request, staggered the remaining update schedules, and enabled npm version requirement increases ([1a2cfab](https://github.com/duonghieu0712z/create-tauri-vue-template/commit/1a2cfabbcee4d95a1b5296e7693e51622df2de4d)).

## [1.0.3] - 2026-09-13

### Added

- Added stricter Rust linting and formatting configuration ([106e3ce](https://github.com/duonghieu0712z/create-tauri-vue-template/commit/106e3ce9b245af684f0894894f9aed67b2f735ac)).

### Fixed

- Prevented the root pre-commit hook from running root Oxc tools against staged template files ([106e3ce](https://github.com/duonghieu0712z/create-tauri-vue-template/commit/106e3ce9b245af684f0894894f9aed67b2f735ac)).
- Corrected template release changelog links to reference the release tag or dispatched commit ([106e3ce](https://github.com/duonghieu0712z/create-tauri-vue-template/commit/106e3ce9b245af684f0894894f9aed67b2f735ac)).

### Changed

- Replaced panic-prone startup paths with explicit error handling and updated template dependencies ([106e3ce](https://github.com/duonghieu0712z/create-tauri-vue-template/commit/106e3ce9b245af684f0894894f9aed67b2f735ac)).
- Centralized the pnpm version in package manifests and updated workflows to read it from the relevant project ([80c1315](https://github.com/duonghieu0712z/create-tauri-vue-template/commit/80c1315d4af3b27e290d05f3a007f5ca719c06a9)).

## [1.0.2] - 2026-09-13

### Changed

- Extracted the template quality checks into a reusable workflow and required them to pass before release builds ([ea66fef](https://github.com/duonghieu0712z/create-tauri-vue-template/commit/ea66feff5bbf951c6091edd08b6f2095f78d3dd5)).
- Aligned template workflows on pnpm 11, updated frontend dependencies, moved the version bump script into `scripts`, and corrected the release asset name pattern ([ea66fef](https://github.com/duonghieu0712z/create-tauri-vue-template/commit/ea66feff5bbf951c6091edd08b6f2095f78d3dd5)).

## [1.0.1] - 2026-08-03

### Fixed

- Installed the packaged template dependencies before running formatting checks in the publish workflow ([1e15ab0](https://github.com/duonghieu0712z/create-tauri-vue-template/commit/1e15ab0de6c76a235edf0128ccc58ba1cf03e181)).

### Changed

- Updated the publish workflow to publish from the release branch and automatically create the corresponding version tag and GitHub release ([7f9a6d9](https://github.com/duonghieu0712z/create-tauri-vue-template/commit/7f9a6d91d5d1ad91ede3ff442686205aaa33b3c2)).
- Updated the packaged template's Tailwind CSS sorting configuration and global styles ([609d1c9](https://github.com/duonghieu0712z/create-tauri-vue-template/commit/609d1c9c9b357c72da7cdf83d4a93968195627ab)).

## [1.0.0] - 2026-07-16

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

[unreleased]: https://github.com/duonghieu0712z/create-tauri-vue-template/compare/v1.0.4...HEAD
[1.0.4]: https://github.com/duonghieu0712z/create-tauri-vue-template/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/duonghieu0712z/create-tauri-vue-template/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/duonghieu0712z/create-tauri-vue-template/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/duonghieu0712z/create-tauri-vue-template/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/duonghieu0712z/create-tauri-vue-template/compare/v0.1.3...v1.0.0
[0.1.3]: https://github.com/duonghieu0712z/create-tauri-vue-template/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/duonghieu0712z/create-tauri-vue-template/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/duonghieu0712z/create-tauri-vue-template/compare/v0.1.0...v0.1.1
