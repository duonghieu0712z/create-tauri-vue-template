import { createInterface } from 'node:readline/promises';

import { formatPrompt, printSection, color } from './color.js';
import { toKebabCase } from './text.js';
import type { CliOptions, PromptDefaults, ResolvedOptions } from './types.js';

function defaultIdentifier(appName: string, author: string): string {
    const owner = author ? toKebabCase(author) : 'example';
    return `com.${owner}.${toKebabCase(appName)}`;
}

export async function promptForMissingOptions(
    options: CliOptions,
    defaults: PromptDefaults,
): Promise<ResolvedOptions> {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
        const appName = options.name?.trim() || defaults.appName;
        const packageName = options.package?.trim() || toKebabCase(appName);

        return {
            name: appName,
            package: packageName,
            id: options.id?.trim() || defaultIdentifier(appName, options.author?.trim() || ''),
            author: options.author?.trim() || '',
            description: options.description?.trim() || '',
        };
    }

    const prompt = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    try {
        printSection('Project identity');

        const appName =
            options.name?.trim() ||
            (await prompt.question(formatPrompt('App name', defaults.appName))).trim() ||
            defaults.appName;
        const author =
            options.author?.trim() ||
            (await prompt.question(`Author ${color.dim('(optional)')}: `)).trim();
        const defaultPackageName = toKebabCase(appName);
        const packageName =
            options.package?.trim() ||
            (await prompt.question(formatPrompt('Package name', defaultPackageName))).trim() ||
            defaultPackageName;
        const defaultAppIdentifier = defaultIdentifier(appName, author);
        const identifier =
            options.id?.trim() ||
            (
                await prompt.question(formatPrompt('Tauri identifier', defaultAppIdentifier))
            ).trim() ||
            defaultAppIdentifier;
        const description =
            options.description?.trim() ||
            (await prompt.question(`Description ${color.dim('(optional)')}: `)).trim();

        return {
            name: appName,
            package: packageName,
            id: identifier,
            author,
            description,
        };
    } finally {
        prompt.close();
    }
}
