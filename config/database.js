module.exports = {
  development: {
    username: root,
    password: null,
    database: 'LumiTest',
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
  },
  test: {
    username: root,
    password: null,
    database: 'LumiTest',
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    logging: null
  },
  production: process.env.DATABASE_URL
};
