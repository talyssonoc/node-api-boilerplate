const { sequelize } = require('src/infra/database/models');

module.exports = () => sequelize.truncate({ cascade: true });
