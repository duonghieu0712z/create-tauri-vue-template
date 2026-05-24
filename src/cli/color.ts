import colors from 'picocolors';

export const color = {
    cyan: colors.cyan,
    dim: colors.dim,
    green: colors.green,
    yellow: colors.yellow,
};

export function printIntro(): void {
    if (!process.stdout.isTTY) {
        return;
    }

    console.log('');
    console.log(color.cyan('Tauri Vue Template'));
    console.log(color.dim('Scaffold a Tauri 2 + Vue 3 desktop app.'));
    console.log('');
}

export function printSection(title: string): void {
    if (!process.stdout.isTTY) {
        return;
    }

    console.log(color.yellow(title));
}

export function formatPrompt(label: string, defaultValue: string): string {
    return `${label} ${color.dim(`(${defaultValue})`)}: `;
}
