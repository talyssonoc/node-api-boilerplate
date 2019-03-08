/* eslint-disable import/no-dynamic-require */

const fs = require('fs');
const path = require('path');

module.exports = {
  load({ factoryGirl, baseFolder, models }) {
    fs
      .readdirSync(baseFolder)
      .filter(file => (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'))
      .forEach((file) => {
        const factoryPath = path.join(baseFolder, file);
        const factory = require(factoryPath);

        factory(factoryGirl, models);
      });

    return factoryGirl;
  },
};
