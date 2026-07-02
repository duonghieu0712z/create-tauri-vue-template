import { readFile, writeFile } from 'node:fs/promises';

import type { Replacement, ReplacementValue } from './types.js';

export async function readJson<T>(path: string): Promise<T> {
    return JSON.parse(await readFile(path, 'utf8')) as T;
}

export async function writeJson(path: string, value: unknown): Promise<void> {
    await writeFile(path, `${JSON.stringify(value, null, 4)}\n`);
}

export function replaceOne(
    content: string,
    pattern: RegExp,
    replacement: ReplacementValue,
    description: string,
): string {
    if (!pattern.test(content)) {
        throw new Error(`Could not update ${description}`);
    }

    if (typeof replacement === 'string') {
        return content.replace(pattern, replacement);
    }

    return content.replace(pattern, replacement);
}

export async function updateText(path: string, replacements: Replacement[]): Promise<void> {
    const content = await readFile(path, 'utf8');
    const updatedContent = replacements.reduce(
        (currentContent, [pattern, replacement]) =>
            replaceOne(currentContent, pattern, replacement, path),
        content,
    );
    await writeFile(path, updatedContent);
}
