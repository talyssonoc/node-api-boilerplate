process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const Console = require('./Console');
const container = require('src/container');

Console.start({
  expose: { container }
});
