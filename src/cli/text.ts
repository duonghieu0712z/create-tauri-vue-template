export function toKebabCase(value: string): string {
    return value
        .trim()
        .replace(/['"]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
}

export function toSnakeCase(value: string): string {
    return toKebabCase(value).replaceAll('-', '_');
}

export function toTitleCase(value: string): string {
    return toKebabCase(value)
        .split('-')
        .filter(Boolean)
        .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
        .join(' ');
}

export function requiredValue(value: string | undefined, name: string): string {
    if (!value) {
        throw new Error(`${name} cannot be empty`);
    }

    return value;
}
