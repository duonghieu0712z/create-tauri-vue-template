#!/usr/bin/env node

import { access, copyFile, cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, dirname, relative, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

function parseArgs(args) {
    const options = {};
    const positionals = [];

    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];

        if (!arg.startsWith('--')) {
            positionals.push(arg);
            continue;
        }

        const key = arg.slice(2);
        const value = args[index + 1];
        if (!value || value.startsWith('--')) {
            throw new Error(`Missing value for --${key}`);
        }

        options[key] = value;
        index += 1;
    }

    return { options, positionals };
}

function toKebabCase(value) {
    return value
        .trim()
        .replace(/['"]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
}

function toSnakeCase(value) {
    return toKebabCase(value).replaceAll('-', '_');
}

function toTitleCase(value) {
    return toKebabCase(value)
        .split('-')
        .filter(Boolean)
        .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
        .join(' ');
}

function requiredValue(value, name) {
    if (!value) {
        throw new Error(`${name} cannot be empty`);
    }

    return value;
}

const supportsColor = process.stdout.isTTY && !process.env.NO_COLOR;

const color = {
    cyan: (value) => (supportsColor ? `\x1b[36m${value}\x1b[0m` : value),
    dim: (value) => (supportsColor ? `\x1b[2m${value}\x1b[0m` : value),
    green: (value) => (supportsColor ? `\x1b[32m${value}\x1b[0m` : value),
    yellow: (value) => (supportsColor ? `\x1b[33m${value}\x1b[0m` : value),
};

function printIntro() {
    if (!process.stdout.isTTY) {
        return;
    }

    console.log('');
    console.log(color.cyan('Tauri Vue Template'));
    console.log(color.dim('Scaffold a Tauri 2 + Vue 3 desktop app.'));
    console.log('');
}

function printSection(title) {
    if (!process.stdout.isTTY) {
        return;
    }

    console.log(color.yellow(title));
}

function formatPrompt(label, defaultValue) {
    return `${label} ${color.dim(`(${defaultValue})`)}: `;
}

function replaceOne(content, pattern, replacement, description) {
    if (!pattern.test(content)) {
        throw new Error(`Could not update ${description}`);
    }

    return content.replace(pattern, replacement);
}

async function promptForMissingOptions(options, defaults) {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
        const appName = options.name?.trim() || defaults.appName;
        const packageName = options.package?.trim() || toKebabCase(appName);

        return {
            ...options,
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
            ...options,
            name: appName,
            package: packageName,
            id: identifier,
            author,
        };
    } finally {
        prompt.close();
    }
}

async function readJson(path) {
    return JSON.parse(await readFile(path, 'utf8'));
}

async function writeJson(path, value) {
    await writeFile(path, `${JSON.stringify(value, null, 4)}\n`);
}

async function updateText(path, replacements) {
    const content = await readFile(path, 'utf8');
    const updatedContent = replacements.reduce(
        (currentContent, [pattern, replacement]) =>
            replaceOne(currentContent, pattern, replacement, path),
        content,
    );
    await writeFile(path, updatedContent);
}

async function updateReleaseWorkflow(path, identity) {
    let content = await readFile(path, 'utf8');
    content = replaceOne(
        content,
        /^(\s*releaseName:\s*).*$/m,
        `$1${identity.appName} v__VERSION__`,
        path,
    );

    if (/^\s*releaseAssetNamePattern:\s*/m.test(content)) {
        content = replaceOne(
            content,
            /^(\s*releaseAssetNamePattern:\s*).*$/m,
            `$1${identity.packageName}_[version]_[arch][setup][ext]`,
            path,
        );
    } else {
        content = replaceOne(
            content,
            /^(\s*prerelease:\s*false)$/m,
            `$1\n          releaseAssetNamePattern: ${identity.packageName}_[version]_[arch][setup][ext]`,
            path,
        );
    }

    await writeFile(path, content);
}

async function ensureEmptyTarget(path) {
    await mkdir(path, { recursive: true });
    const entries = await readdir(path);
    if (entries.length > 0) {
        throw new Error(`Target directory is not empty: ${path}`);
    }
}

async function ensureTemplate(templateDir) {
    try {
        await access(templateDir);
    } catch {
        await import('../scripts/prepare-template.js');
    }
}

async function renameProject(targetDir, identity) {
    const packageJsonPath = resolve(targetDir, 'package.json');
    const packageJson = await readJson(packageJsonPath);
    packageJson.name = identity.packageName;
    if (identity.author) {
        packageJson.author = identity.author;
    } else {
        delete packageJson.author;
    }
    await writeJson(packageJsonPath, packageJson);

    const tauriConfigPath = resolve(targetDir, 'src-tauri', 'tauri.conf.json');
    const tauriConfig = await readJson(tauriConfigPath);
    tauriConfig.productName = identity.appName;
    tauriConfig.identifier = identity.identifier;
    tauriConfig.app.windows = tauriConfig.app.windows.map((window) => ({
        ...window,
        title: window.title ? identity.appName : window.title,
    }));
    if (identity.author) {
        tauriConfig.bundle.publisher = identity.author;
    } else {
        delete tauriConfig.bundle.publisher;
    }
    await writeJson(tauriConfigPath, tauriConfig);

    await updateText(resolve(targetDir, 'index.html'), [
        [/<title>.*<\/title>/, `<title>${identity.appName}</title>`],
    ]);

    await updateText(resolve(targetDir, 'src-tauri', 'Cargo.toml'), [
        [/^name = "([^"]+)"/m, `name = "${identity.crateName}"`],
        [/^description = "([^"]+)"/m, `description = "${identity.appName}"`],
        [/^(\[lib\]\s+[\s\S]*?^name = )"([^"]+)"/m, `$1"${identity.crateLibName}"`],
    ]);

    await updateText(resolve(targetDir, 'src-tauri', 'Cargo.toml'), [
        [
            /^authors = \[[^\]]*\]/m,
            identity.author ? `authors = ["${identity.author}"]` : 'authors = []',
        ],
    ]);

    await updateText(resolve(targetDir, 'src-tauri', 'src', 'main.rs'), [
        [/[a-zA-Z0-9_]+_lib::run\(\)/, `${identity.crateLibName}::run()`],
    ]);

    await updateReleaseWorkflow(
        resolve(targetDir, '.github', 'workflows', 'release.yml'),
        identity,
    );
}

async function writeEditorSettings(targetDir, packageDir) {
    await mkdir(resolve(targetDir, '.vscode'), { recursive: true });
    await copyFile(
        resolve(packageDir, 'assets', 'vscode-settings.json'),
        resolve(targetDir, '.vscode', 'settings.json'),
    );
}

async function main() {
    const { options, positionals } = parseArgs(process.argv.slice(2));

    if (!positionals[0] && !options.name && (!process.stdin.isTTY || !process.stdout.isTTY)) {
        throw new Error(
            'Usage: pnpm create @duonghieu0712z/tauri-vue-template@latest [project-dir] --name "My App" --id "com.example.my-app"',
        );
    }

    printIntro();

    const defaultAppName = positionals[0] ? toTitleCase(basename(positionals[0])) : 'Tauri Vue App';
    const resolvedOptions = await promptForMissingOptions(options, {
        appName: defaultAppName,
    });
    const appName = requiredValue(resolvedOptions.name?.trim() || defaultAppName, 'App name');
    const packageName = requiredValue(
        resolvedOptions.package?.trim() || toKebabCase(appName),
        'Package name',
    );
    const targetArg = positionals[0] || packageName;
    const targetDir = resolve(process.cwd(), targetArg);
    const crateName = toKebabCase(packageName);
    const crateLibName = `${toSnakeCase(crateName)}_lib`;
    const identifier = requiredValue(
        resolvedOptions.id?.trim() || `com.example.${packageName}`,
        'Tauri identifier',
    );
    const author = resolvedOptions.author?.trim();

    const currentDir = dirname(fileURLToPath(import.meta.url));
    const packageDir = resolve(currentDir, '..');
    const templateDir = resolve(packageDir, 'template');

    await ensureTemplate(templateDir);
    await ensureEmptyTarget(targetDir);
    await cp(templateDir, targetDir, { recursive: true });
    await writeEditorSettings(targetDir, packageDir);
    await renameProject(targetDir, {
        appName,
        packageName,
        crateName,
        crateLibName,
        identifier,
        author,
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
    console.error(error.message);
    process.exit(1);
}
