module.exports = {
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2022,
    },
    extends: ['airbnb-base', 'plugin:prettier/recommended'],
    rules: {
        'consistent-return': 'off',
        'import/extensions': 'off',
        'no-underscore-dangle': 'off',
        'func-names': 'off',
        'import/prefer-default-export': 'off',
        'no-shadow': 'off',
    },
}
