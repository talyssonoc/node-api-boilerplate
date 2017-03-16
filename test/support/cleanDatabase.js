const container = require('src/container');
const database = container.resolve('database');

module.exports = () => database.truncate({ cascade: true });
