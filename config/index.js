require('dotenv').load();

const fs = require('fs');
const path = require('path');

const ENV = process.env.NODE_ENV || 'development';

//deprecated
//const envConfig = require(path.join(__dirname, 'environments', ENV, ENV)+'.js');
const dbConfig = loadDbConfig();

const config = Object.assign({}, {
  [ENV]: true,
  env: ENV,
  db: dbConfig
});

// the injection here is done quasi-statically, it should be done in a more dynamic way by matching NODE_DEV names with container registration for the configuration
//so you will be automatically injecting the configuration based on the ENV name, or a selection cna be done by registering all configs and injecting them all and then choosing what to use
//inside the next factory function
module.exports = ({devConfig})=>{

  return Object.assign({}, config, devConfig.config);
};

function loadDbConfig() {
  if(process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  if(fs.existsSync(path.join(__dirname, './database.js'))) {
    return require('./database')[ENV];
  }
}
