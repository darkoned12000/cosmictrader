// Jest configuration for ES6 modules
export default {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/tests/**/*.test.js'
  ],
  collectCoverageFrom: [
    'core/**/*.js',
    'modules/**/*.js',
    'data/**/*.js',
    '!**/node_modules/**'
  ]
};