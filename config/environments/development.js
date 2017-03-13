const path = require('path');
const logPath = path.join(__dirname, '../../logs/development.log');

module.exports = {
  web: {
    port: 3000
  },
  logging: {
    appenders: [
      { type: 'console' },
      { type: 'file', filename: logPath }
    ]
  }
};
