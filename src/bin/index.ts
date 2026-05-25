#!/usr/bin/env node

import { createRequire } from 'node:module';
import { basename, dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cac } from 'cac';

import { color, printIntro } from '../cli/color.js';
import { promptForMissingOptions } from '../cli/prompts.js';
import { scaffoldProject } from '../cli/scaffold.js';
import { requiredValue, toKebabCase, toSnakeCase, toTitleCase } from '../cli/text.js';
import type { CliOptions } from '../cli/types.js';

type CliCommandOptions = CliOptions & {
    help?: boolean;
    version?: boolean;
};

type CliCommand = {
    projectDir?: string;
    options: CliOptions;
};

const require = createRequire(import.meta.url);
const packageJson = require('../../package.json') as { version: string };

function parseCommand(): CliCommand {
    const cli = cac('create-tauri-vue-template');

    cli.usage('[project-dir] [options]')
        .option('--name <name>', 'Application display name')
        .option('--package <name>', 'Package name')
        .option('--id <identifier>', 'Tauri application identifier')
        .option('--author <name>', 'Project author')
        .option('--description <description>', 'Project description')
        .help()
        .version(packageJson.version);

    const parsed = cli.parse(process.argv, { run: false });
    if (process.argv.includes('--help') || process.argv.includes('-h')) {
        process.exit(0);
    }
    if (process.argv.includes('--version') || process.argv.includes('-v')) {
        process.exit(0);
    }

    const options = parsed.options as CliCommandOptions;

    return {
        projectDir: parsed.args[0],
        options: {
            name: options.name,
            package: options.package,
            id: options.id,
            author: options.author,
            description: options.description,
        },
    };
}

async function main(): Promise<void> {
    const { projectDir, options } = parseCommand();

    if (!projectDir && !options.name && (!process.stdin.isTTY || !process.stdout.isTTY)) {
        throw new Error(
            'Usage: pnpm create @duonghieu0712z/tauri-vue-template@latest [project-dir] --name "My App"',
        );
    }

    printIntro();

    const defaultAppName = projectDir ? toTitleCase(basename(projectDir)) : 'Tauri Vue App';
    const resolvedOptions = await promptForMissingOptions(options, {
        appName: defaultAppName,
    });
    const appName = requiredValue(resolvedOptions.name?.trim() || defaultAppName, 'App name');
    const packageName = requiredValue(
        resolvedOptions.package?.trim() || toKebabCase(appName),
        'Package name',
    );
    const targetArg = projectDir || packageName;
    const targetDir = resolve(process.cwd(), targetArg);
    const crateName = toKebabCase(packageName);
    const crateLibName = `${toSnakeCase(crateName)}_lib`;
    const author = resolvedOptions.author?.trim();
    const identifier = requiredValue(
        resolvedOptions.id?.trim() ||
            `com.${author ? toKebabCase(author) : 'example'}.${toKebabCase(appName)}`,
        'Tauri identifier',
    );
    const description = resolvedOptions.description?.trim();

    const currentDir = dirname(fileURLToPath(import.meta.url));
    const packageDir = resolve(currentDir, '..', '..');

    await scaffoldProject(targetDir, packageDir, {
        appName,
        packageName,
        crateName,
        crateLibName,
        identifier,
        author,
        description,
    });

    const relativeTargetDir = relative(process.cwd(), targetDir) || '.';
    console.log('');
    console.log(`${color.green('Created')} ${appName} in ${color.cyan(relativeTargetDir)}`);
    console.log('');
    console.log(color.yellow('Next steps:'));
    console.log(`  ${color.cyan(`cd ${relativeTargetDir}`)}`);
    console.log(`  ${color.cyan('pnpm install')}`);
    console.log(`  ${color.cyan('pnpm start')}`);
}

try {
    await main();
} catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
}
