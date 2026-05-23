#!/usr/bin/env node

import { cp, readdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const packageDir = resolve(currentDir, '..');
const repoRoot = resolve(packageDir, '..', '..');
const templateDir = resolve(packageDir, 'template');

const excludedPaths = new Set([
    '.git',
    '.eslintcache',
    '.codex-gh-output-test.txt',
    'dist',
    'node_modules',
    'packages',
    'src-tauri/target',
]);

function normalizePath(path) {
    return path.replaceAll('\\', '/');
}

function filter(source) {
    const relativePath = normalizePath(source.slice(repoRoot.length + 1));
    return !excludedPaths.has(relativePath);
}

await rm(templateDir, { recursive: true, force: true });
await readdir(repoRoot).then((entries) =>
    Promise.all(
        entries
            .filter((entry) => filter(resolve(repoRoot, entry)))
            .map((entry) =>
                cp(resolve(repoRoot, entry), resolve(templateDir, entry), {
                    recursive: true,
                    filter,
                }),
            ),
    ),
);

console.log(`Prepared template at ${templateDir}`);
