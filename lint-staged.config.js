const normalizePath = (file) => file.replaceAll('\\', '/');

const filterFiles = (files) => files.filter((file) => !normalizePath(file).includes('/template/'));

const quotePath = (file) => `"${file.replaceAll('"', '\\"')}"`;

const createCommand = (command, files) => `${command} ${files.map(quotePath).join(' ')}`;

const createTask = (command) => (files) => {
    const filtered = filterFiles(files);
    return filtered.length > 0 ? createCommand(command, filtered) : [];
};

export default {
    '*.{js,ts,json,yml,yaml,md}': createTask('oxfmt --no-error-on-unmatched-pattern'),
    '*.{js,ts}': createTask('oxlint --fix'),
};
