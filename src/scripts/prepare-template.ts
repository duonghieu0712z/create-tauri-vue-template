#!/usr/bin/env node

import { createWriteStream } from 'node:fs';
import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';
import { extract } from 'tar';

const currentDir = dirname(fileURLToPath(import.meta.url));
const packageDir = resolve(currentDir, '..', '..');
const templateDir = resolve(packageDir, 'template');
const archivePath = resolve(packageDir, '.tmp-template.tar.gz');
const templateRepo = process.env.TAURI_VUE_TEMPLATE_REPO || 'duonghieu0712z/tauri-vue-template';
const templateRef = process.env.TAURI_VUE_TEMPLATE_REF || 'main';
const templateSourceDir = process.env.TAURI_VUE_TEMPLATE_SOURCE
    ? resolve(process.env.TAURI_VUE_TEMPLATE_SOURCE)
    : null;

const excludedPaths = new Set([
    '.git',
    '.eslintcache',
    'dist',
    'node_modules',
    'packages',
    'src-tauri/target',
]);

function normalizePath(path: string): string {
    return path.replaceAll('\\', '/');
}

function shouldInclude(relativePath: string): boolean {
    return !excludedPaths.has(normalizePath(relativePath));
}

async function copyTemplateSource(sourceDir: string): Promise<void> {
    await mkdir(templateDir, { recursive: true });
    await readdir(sourceDir).then((entries) =>
        Promise.all(
            entries
                .filter((entry) => shouldInclude(entry))
                .map((entry) =>
                    cp(resolve(sourceDir, entry), resolve(templateDir, entry), {
                        recursive: true,
                        filter: (source) =>
                            shouldInclude(
                                normalizePath(source).slice(normalizePath(sourceDir).length + 1),
                            ),
                    }),
                ),
        ),
    );
}

async function downloadTemplateArchive(): Promise<void> {
    const archiveUrl = `https://github.com/${templateRepo}/archive/${templateRef}.tar.gz`;
    const response = await fetch(archiveUrl);

    if (!response.ok || !response.body) {
        throw new Error(`Could not download template archive: ${archiveUrl}`);
    }

    await pipeline(response.body, createWriteStream(archivePath));
}

async function extractTemplateArchive(): Promise<void> {
    await mkdir(templateDir, { recursive: true });
    await extract({
        file: archivePath,
        cwd: templateDir,
        strip: 1,
        filter: (path) => shouldInclude(path.split('/').slice(1).join('/')),
    });
}

await rm(templateDir, { recursive: true, force: true });
await rm(archivePath, { force: true });

if (templateSourceDir) {
    await copyTemplateSource(templateSourceDir);
} else {
    await downloadTemplateArchive();
    await extractTemplateArchive();
    await rm(archivePath, { force: true });
}

console.log(`Prepared template at ${templateDir}`);
