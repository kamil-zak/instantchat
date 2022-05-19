module.exports = {
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2022,
    },
    env: {
        node: true,
        browser: true,
    },
    extends: ['react-app', 'plugin:react/recommended', 'airbnb-base', 'plugin:prettier/recommended'],
    rules: {
        'consistent-return': 'off',
        'import/extensions': 'off',
        'no-underscore-dangle': 'off',
        'func-names': 'off',
        'import/prefer-default-export': 'off',
        'no-shadow': 'off',
    },
}
