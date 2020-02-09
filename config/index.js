require('dotenv').load();

const fs = require('fs');
const path = require('path');

const ENV = process.env.NODE_ENV || 'development';

//deprecated
const envConfig = require(path.join(__dirname, 'environments', ENV, ENV)+'.js');
const dbConfig = loadDbConfig();

const config = Object.assign({}, {
  [ENV]: true,
  env: ENV,
  db: dbConfig
});


//The injection is done based on two environments you should change this when adding more
//UPDATE : we got rid of the injection due to multiple subsequent injections needed.

module.exports =  Object.assign({}, config, envConfig.config);

function loadDbConfig() {
  if(process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  if(fs.existsSync(path.join(__dirname, './database.js'))) {
    return require('./database')[ENV];
  }
}
