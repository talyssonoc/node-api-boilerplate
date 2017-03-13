console.log(process.env.DATABASE_URL);

module.exports = {
  production: {
    dialect: 'postgres',
    url: process.env.DATABASE_URL
  }
};
