const container = require('src/container');

container.resolve('database');

const cleanDatabase = require('specs/support/cleanDatabase');

beforeEach(cleanDatabase);
