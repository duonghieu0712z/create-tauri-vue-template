# Create Tauri Vue Template

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

The CLI source lives in `src/` and is compiled to `dist/`. The published package runs the compiled JavaScript entry at `dist/bin/index.js`.

Check formatting and linting:

```bash
pnpm build
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
pnpm build
node dist/bin/index.js
```

Run without prompts:

```bash
pnpm build
node dist/bin/index.js --name "My App" --id "com.example.my-app" --author "Your Name"
```

## Publish

Build and inspect the npm package tarball contents through the `prepack` script. This compiles TypeScript to `dist/` and prepares the bundled template before packing:

```bash
pnpm pack --dry-run
```

Publish the package:

```bash
pnpm publish --access public
```
