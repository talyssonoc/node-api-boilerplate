require('dotenv').load();

const path = require('path');
const ENV = process.env.NODE_ENV || 'development';

const envConfig = require(path.join(__dirname, 'environments', ENV));
const dbConfig = process.env.DATABASE_URL || require('./database')[ENV];

const config = Object.assign({
  [ENV]: true,
  env: ENV,
  db: dbConfig
}, envConfig);

module.exports = config;
