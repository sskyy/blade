module.exports = {
  plugins: ['react'],
  extends: ['semistandard'],
  env: {
    es6: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      impliedStrict: true,
      experimentalObjectRestSpread: true,
      jsx: true
    }
  }
}