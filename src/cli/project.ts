import { resolve } from 'node:path';

import { readJson, updateText, writeJson } from './files.js';
import type { ProjectIdentity } from './types.js';

type PackageJson = {
    name: string;
    version: string;
    author?: string;
    description?: string;
    [key: string]: unknown;
};

type TauriConfig = {
    productName: string;
    version: string;
    identifier: string;
    app: {
        windows: Array<{
            title?: string;
            [key: string]: unknown;
        }>;
        [key: string]: unknown;
    };
    bundle: {
        publisher?: string;
        [key: string]: unknown;
    };
    [key: string]: unknown;
};

const initialProjectVersion = '0.0.1';

function literal(value: string): () => string {
    return () => value;
}

function tomlString(value: string): string {
    return JSON.stringify(value);
}

export async function renameProject(targetDir: string, identity: ProjectIdentity): Promise<void> {
    const packageJsonPath = resolve(targetDir, 'package.json');
    const packageJson = await readJson<PackageJson>(packageJsonPath);
    packageJson.name = identity.packageName;
    packageJson.version = initialProjectVersion;
    if (identity.author) {
        packageJson.author = identity.author;
    } else {
        delete packageJson.author;
    }
    if (identity.description) {
        packageJson.description = identity.description;
    } else {
        delete packageJson.description;
    }
    await writeJson(packageJsonPath, packageJson);

    const tauriConfigPath = resolve(targetDir, 'src-tauri', 'tauri.conf.json');
    const tauriConfig = await readJson<TauriConfig>(tauriConfigPath);
    tauriConfig.productName = identity.appName;
    tauriConfig.version = initialProjectVersion;
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
        [/<title>.*<\/title>/, literal(`<title>${identity.appName}</title>`)],
    ]);

    await updateText(resolve(targetDir, 'README.md'), [
        [/^# .+$/m, literal(`# ${identity.appName}`)],
    ]);

    await updateText(resolve(targetDir, 'src-tauri', 'Cargo.toml'), [
        [/^name = "([^"]+)"/m, `name = "${identity.crateName}"`],
        [/^version = "([^"]+)"/m, `version = "${initialProjectVersion}"`],
        [
            /^description = "([^"]+)"/m,
            literal(`description = ${tomlString(identity.description || identity.appName)}`),
        ],
        [/^(\[lib\]\s+[\s\S]*?^name = )"([^"]+)"/m, `$1"${identity.crateLibName}"`],
    ]);

    await updateText(resolve(targetDir, 'src-tauri', 'Cargo.toml'), [
        [
            /^authors = \[[^\]]*\]/m,
            literal(
                identity.author ? `authors = [${tomlString(identity.author)}]` : 'authors = []',
            ),
        ],
    ]);

    await updateText(resolve(targetDir, 'src-tauri', 'src', 'main.rs'), [
        [/[a-zA-Z0-9_]+_lib::run\(\)/, `${identity.crateLibName}::run()`],
    ]);
}
