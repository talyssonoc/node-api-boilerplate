const path = require('path');

module.exports = function createControllerRoutes(_controllerPath) {
  const controllerPath = path.resolve('src/interfaces/http', _controllerPath);
  const Controller = require(controllerPath);

  const controller = new Controller();

  return controller.router;
};
