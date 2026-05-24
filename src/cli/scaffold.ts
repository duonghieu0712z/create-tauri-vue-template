import { access, copyFile, cp, mkdir, readdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

import { renameProject } from './project.js';
import type { ProjectIdentity } from './types.js';

export async function ensureEmptyTarget(path: string): Promise<void> {
    await mkdir(path, { recursive: true });
    const entries = await readdir(path);
    if (entries.length > 0) {
        throw new Error(`Target directory is not empty: ${path}`);
    }
}

export async function ensureTemplate(templateDir: string): Promise<void> {
    try {
        await access(templateDir);
    } catch {
        await import('../scripts/prepare-template.js');
    }
}

export async function writeEditorSettings(targetDir: string, packageDir: string): Promise<void> {
    await mkdir(resolve(targetDir, '.vscode'), { recursive: true });
    await copyFile(
        resolve(packageDir, 'assets', 'vscode-settings.json'),
        resolve(targetDir, '.vscode', 'settings.json'),
    );
}

async function removeTemplateArtifacts(targetDir: string): Promise<void> {
    await Promise.all(
        ['CHANGELOG.md', 'Changelog.md', 'changelog.md'].map((fileName) =>
            rm(resolve(targetDir, fileName), { force: true }),
        ),
    );
}

async function restorePackagedGitignore(targetDir: string): Promise<void> {
    const entries = await readdir(targetDir, { withFileTypes: true });

    await Promise.all(
        entries.map(async (entry) => {
            const entryPath = resolve(targetDir, entry.name);

            if (entry.isDirectory()) {
                await restorePackagedGitignore(entryPath);
                return;
            }

            if (entry.isFile() && entry.name === '_gitignore') {
                await copyFile(entryPath, resolve(targetDir, '.gitignore'));
                await rm(entryPath, { force: true });
            }
        }),
    );
}

export async function scaffoldProject(
    targetDir: string,
    packageDir: string,
    identity: ProjectIdentity,
): Promise<void> {
    const templateDir = resolve(packageDir, 'template');

    await ensureTemplate(templateDir);
    await ensureEmptyTarget(targetDir);
    await cp(templateDir, targetDir, { recursive: true });
    await restorePackagedGitignore(targetDir);
    await removeTemplateArtifacts(targetDir);
    await writeEditorSettings(targetDir, packageDir);
    await renameProject(targetDir, identity);
}
