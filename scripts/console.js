const Console = require('tbp/Console');
const container = require('src/container');

Console.start({
  expose: { container }
});
