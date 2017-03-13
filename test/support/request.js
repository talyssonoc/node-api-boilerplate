const request = require('supertest-as-promised');
const container = require('src/container');
const server = container.resolve('server');

module.exports = () => request(server.express);
