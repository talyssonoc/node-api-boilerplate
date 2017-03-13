const {
  DB_USER: username,
  DB_PWD: password,
  DB_NAME: database,
  DB_HOST: host
} = process.env;

module.exports = {
  production: {
    username, password,
    database, host
    dialect: 'postgres'
  }
};
