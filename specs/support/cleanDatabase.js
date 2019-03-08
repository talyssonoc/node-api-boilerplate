const container = require('src/container');

const database = container.resolve('database');

module.exports = () => database && database.truncate({ cascade: true });
