export type CliOptions = {
    name?: string;
    package?: string;
    id?: string;
    author?: string;
    description?: string;
};

export type PromptDefaults = {
    appName: string;
};

export type ResolvedOptions = Required<Pick<CliOptions, 'name' | 'package' | 'id'>> &
    Pick<CliOptions, 'author' | 'description'>;

export type ProjectIdentity = {
    appName: string;
    packageName: string;
    crateName: string;
    crateLibName: string;
    identifier: string;
    author?: string;
    description?: string;
};

export type Replacement = [pattern: RegExp, replacement: string];
