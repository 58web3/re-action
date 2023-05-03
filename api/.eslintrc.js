module.exports = {
  root: true,
  env: {
    'browser': true,
    'node': true,
    'es6': true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  extends: [
    'google',
  ],
  rules: {
    'no-console': 'off',
  },
};
