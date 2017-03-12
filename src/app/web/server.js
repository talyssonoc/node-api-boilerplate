const cors = require('cors');
const bodyParser = require('body-parser');
const hpp = require('hpp');
const compression = require('compression');
const morgan = require('morgan');
const methodOverride = require('method-override');
const statusMonitor = require('express-status-monitor');
const Server = require('src/infra/web/Server');
const config = require('config');
const router = require('./router');
const errorHandler = require('../errors/errorHandler');

const server = new Server({ config });

/* istanbul ignore if */
if(config.env === 'development') {
  server.use(statusMonitor());
}

server
  .use(methodOverride('X-HTTP-Method-Override'))
  .use(cors())
  .use(bodyParser.json())
  .use(hpp())
  .use(compression());

/* istanbul ignore if */
if(config.env !== 'test') {
  server.use(morgan('dev'));
}

server.use(router);
server.use(errorHandler);

module.exports = server;
