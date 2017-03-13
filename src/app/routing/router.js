const { Router } = require('express');
const statusMonitor = require('express-status-monitor');
const cors = require('cors');
const bodyParser = require('body-parser');
const hpp = require('hpp');
const compression = require('compression');
const methodOverride = require('method-override');
const controller = require('./createControllerRoute');

module.exports = ({ config, containerMiddleware, requestLoggerMiddleware , errorHandler }) => {
  const router = Router();

  /* istanbul ignore if */
  if(config.env === 'development') {
    router.use(statusMonitor());
  }

  router
    .use(methodOverride('X-HTTP-Method-Override'))
    .use(cors())
    .use(bodyParser.json())
    .use(hpp())
    .use(compression());

  /* istanbul ignore if */
  if(config.env !== 'test') {
    router.use(requestLoggerMiddleware);
  }

  const apiRouter = Router();

  apiRouter.use(containerMiddleware);
  apiRouter.use('/users', controller('user/UsersController'));

  router.use('/api', apiRouter);

  router.use(errorHandler);

  return router;
};
