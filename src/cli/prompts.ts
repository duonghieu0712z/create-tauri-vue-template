import { createInterface } from 'node:readline/promises';

import { formatPrompt, printSection, color } from './color.js';
import { toKebabCase } from './text.js';
import type { CliOptions, PromptDefaults, ResolvedOptions } from './types.js';

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
            id: options.id?.trim() || `com.example.${packageName}`,
            author: options.author?.trim() || '',
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
        const defaultPackageName = toKebabCase(appName);
        const packageName =
            options.package?.trim() ||
            (await prompt.question(formatPrompt('Package name', defaultPackageName))).trim() ||
            defaultPackageName;
        const defaultIdentifier = `com.example.${packageName}`;
        const identifier =
            options.id?.trim() ||
            (await prompt.question(formatPrompt('Tauri identifier', defaultIdentifier))).trim() ||
            defaultIdentifier;
        const author =
            options.author?.trim() ||
            (await prompt.question(`Author ${color.dim('(optional)')}: `)).trim();

        return {
            name: appName,
            package: packageName,
            id: identifier,
            author,
        };
    } finally {
        prompt.close();
    }
}
