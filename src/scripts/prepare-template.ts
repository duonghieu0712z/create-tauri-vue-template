#!/usr/bin/env node

import { copyFile, cp, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const packageDir = resolve(currentDir, '..', '..');
const templateDir = resolve(packageDir, 'template');
const templateSourceDir = process.env.TAURI_VUE_TEMPLATE_SOURCE
    ? resolve(process.env.TAURI_VUE_TEMPLATE_SOURCE)
    : null;

const excludedPaths = new Set([
    '.git',
    '.eslintcache',
    'dist',
    'dist-ssr',
    'node_modules',
    'packages',
    'src-tauri/target',
    'src-tauri/gen/schemas',
]);
const excludedFileNames = new Set(['changelog.md']);

function normalizePath(path: string): string {
    return path.replaceAll('\\', '/');
}

function shouldInclude(relativePath: string): boolean {
    const normalizedPath = normalizePath(relativePath);
    const fileName = normalizedPath.split('/').at(-1)?.toLowerCase();
    const pathParts = normalizedPath.split('/');

    if (!normalizedPath || excludedFileNames.has(fileName ?? '')) {
        return false;
    }

    if (
        fileName?.endsWith('.log') ||
        fileName?.startsWith('npm-debug.log') ||
        fileName?.startsWith('yarn-debug.log') ||
        fileName?.startsWith('yarn-error.log') ||
        fileName?.startsWith('pnpm-debug.log') ||
        fileName?.startsWith('lerna-debug.log') ||
        fileName?.endsWith('.local') ||
        fileName?.endsWith('.tsbuildinfo')
    ) {
        return false;
    }

    if (
        excludedPaths.has(normalizedPath) ||
        [...excludedPaths].some((path) => normalizedPath.startsWith(`${path}/`))
    ) {
        return false;
    }

    if (
        (pathParts[0] === 'logs' ||
            pathParts[0] === '.idea' ||
            pathParts[0] === '.eslintcache' ||
            pathParts[0] === 'node_modules' ||
            pathParts[0] === 'dist' ||
            pathParts[0] === 'dist-ssr') &&
        pathParts.length >= 1
    ) {
        return false;
    }

    if (
        pathParts[0] === '.vscode' &&
        normalizedPath !== '.vscode' &&
        normalizedPath !== '.vscode/extensions.json' &&
        normalizedPath !== '.vscode/settings.json'
    ) {
        return false;
    }

    if (pathParts[0] === '.husky' && pathParts[1] === '_' && normalizedPath !== '.husky/_') {
        return false;
    }

    return true;
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

async function stagePackagedGitignore(): Promise<void> {
    async function visit(dir: string): Promise<void> {
        const entries = await readdir(dir, { withFileTypes: true });

        await Promise.all(
            entries.map(async (entry) => {
                const entryPath = resolve(dir, entry.name);

                if (entry.isDirectory()) {
                    await visit(entryPath);
                    return;
                }

                if (entry.isFile() && entry.name === '.gitignore') {
                    await copyFile(entryPath, resolve(dir, '_gitignore'));
                    await rm(entryPath, { force: true });
                }
            }),
        );
    }

    try {
        await visit(templateDir);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            throw error;
        }
    }
}

if (!templateSourceDir) {
    throw new Error('TAURI_VUE_TEMPLATE_SOURCE is required to refresh the packaged template');
}

await rm(templateDir, { recursive: true, force: true });

await copyTemplateSource(templateSourceDir);
await stagePackagedGitignore();

console.log(`Prepared template at ${templateDir}`);
