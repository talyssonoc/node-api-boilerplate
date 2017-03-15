process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const Console = require('tbp/Console');
const container = require('src/container');

Console.start({
  expose: { container }
});
