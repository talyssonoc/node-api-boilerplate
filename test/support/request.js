const request = require('supertest-as-promised');
const server = require('src/app/web/server');

module.exports = () => request(server.express);
