export default {
    '*.{js,ts,json,yml,yaml,md}': ['oxfmt --no-error-on-unmatched-pattern'],
    '*.{js,ts}': ['oxlint --fix'],
};
