const path = require('path');

module.exports = ({ baseFolder }) => {
  return function createControllerRoute(_controllerPath) {
    const controllerPath = path.resolve(baseFolder, _controllerPath);
    const Controller = require(controllerPath);

    const controller = new Controller();

    return controller.getRouter();
  };
};
