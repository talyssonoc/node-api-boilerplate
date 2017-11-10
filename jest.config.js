module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/container.js',
    '<rootDir>/src/app/Application.js',
    '<rootDir>/src/interfaces/http/',
    '<rootDir>/src/infra/database/migrate/',
    '<rootDir>/src/infra/database/seeds/',
  ],
  coverageReporters: [
    'html',
    'lcov',
    'text-summary'
  ],
  setupFiles: ['<rootDir>/test/setup.js']
};
