const { database } = require('src/infra/database/models');

module.exports = () => database.truncate({ cascade: true });
