/* eslint-disable */

/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  // General.
  "testMatch": [
    "<rootDir>/build/test/**/*.test.js",
  ],

  // Coverage.
  collectCoverage: true,
  coverageDirectory: "./build/coverage",
  coverageProvider: "v8",

  // Watch.
  watchPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/src/",
    "<rootDir>/test/",
  ],

  // Extensions.
  setupFilesAfterEnv: [
    '@theroyalwhee0/tobelike'
  ],
};
