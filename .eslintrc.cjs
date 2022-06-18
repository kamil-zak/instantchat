module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2022,
    },
    extends: ['airbnb-base', 'plugin:prettier/recommended', 'plugin:@typescript-eslint/recommended', 'plugin:import/typescript'],
    rules: {
        'consistent-return': 'off',
        'import/extensions': 'off',
        'no-underscore-dangle': 'off',
        'func-names': 'off',
        'import/prefer-default-export': 'off',
        'no-shadow': 'off',
    },
}
