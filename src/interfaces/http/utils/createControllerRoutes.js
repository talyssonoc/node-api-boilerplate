const path = require('path');

module.exports = function createControllerRoutes(controllerUri) {
  const controllerPath = path.resolve('src/interfaces/http', controllerUri);
  // eslint-disable-next-line import/no-dynamic-require
  const Controller = require(controllerPath);

  return Controller.router;
};
