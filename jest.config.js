module.exports = {
  verbose: true,
  testURL: 'http://localhost',
  collectCoverage: true,
  coverageReporters: ['text-summary', 'lcov'],
  testEnvironment: 'node',
  collectCoverageFrom: [
    /**
     * Accept this files
     */
    'src/app/**/*.js',
    'src/app/*.js',
    'src/domain/**/*.js',
    'src/infra/**/*.js',
    'src/infra/**/**/*.js',
    'src/interfaces/*.js',
    'src/interfaces/**/*.js',
    'src/interfaces/**/**/*.js',
    /**
     * Ignore the following files
     */
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  setupFilesAfterEnv: [
    './specs/setup.js',
  ],
  cache: false,
};
