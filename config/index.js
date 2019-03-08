const fs = require('fs');
const path = require('path');

const ENV = process.env.NODE_ENV || 'development';

// eslint-disable-next-line consistent-return
function loadDbConfig() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  if (fs.existsSync(path.join(__dirname, './database.js'))) {
    return require('./database')[ENV];
  }
}

module.exports = {
  db: loadDbConfig(),
};

