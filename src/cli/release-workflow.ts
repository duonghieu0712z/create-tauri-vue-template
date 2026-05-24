import { readFile, writeFile } from 'node:fs/promises';

import { replaceOne } from './files.js';
import type { ProjectIdentity } from './types.js';

export async function updateReleaseWorkflow(
    path: string,
    identity: ProjectIdentity,
): Promise<void> {
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
