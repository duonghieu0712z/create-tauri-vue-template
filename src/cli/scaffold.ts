import { access, copyFile, cp, mkdir, readdir } from 'node:fs/promises';
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

export async function scaffoldProject(
    targetDir: string,
    packageDir: string,
    identity: ProjectIdentity,
): Promise<void> {
    const templateDir = resolve(packageDir, 'template');

    await ensureTemplate(templateDir);
    await ensureEmptyTarget(targetDir);
    await cp(templateDir, targetDir, { recursive: true });
    await writeEditorSettings(targetDir, packageDir);
    await renameProject(targetDir, identity);
}
