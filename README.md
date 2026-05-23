# create-tauri-vue-template

Create a Tauri 2 + Vue 3 desktop app from the `tauri-vue-template` starter.

## Usage

Run the interactive scaffold:

```bash
pnpm create @duonghieu0712z/tauri-vue-template@latest
```

Pass values directly when needed:

```bash
pnpm create @duonghieu0712z/tauri-vue-template@latest my-app --name "My App" --id "com.example.my-app" --author "Your Name"
```

The CLI copies the bundled template into the target directory, updates the package name, Tauri product name, application identifier, Rust crate names, release workflow metadata, and VS Code workspace settings.

## Development

Install dependencies:

```bash
pnpm install
```

Check formatting and linting:

```bash
pnpm format
pnpm lint
```

Apply automatic fixes:

```bash
pnpm format:fix
pnpm lint:fix
```

## Local Test

Run the CLI from this repository:

```bash
node bin/index.js
```

Run without prompts:

```bash
node bin/index.js --name "My App" --id "com.example.my-app" --author "Your Name"
```

## Publish

Build the npm package tarball contents through the `prepack` script:

```bash
pnpm pack --dry-run
```

Publish the package:

```bash
pnpm publish --access public
```
