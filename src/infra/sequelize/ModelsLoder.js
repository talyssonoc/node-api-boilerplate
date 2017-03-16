const fs = require('fs');
const path = require('path');

module.exports = {
  load({ sequelize, baseFolder, indexFile = 'index.js' }) {
    const loaded = {};

    fs
      .readdirSync(baseFolder)
      .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== indexFile) && (file.slice(-3) === '.js');
      })
      .forEach((file) => {
        const model = sequelize['import'](path.join(baseFolder, file));
        const modelName = file.split('.')[0];
        loaded[modelName] = model;
      });

    Object.keys(loaded).forEach((modelName) => {
      if(loaded[modelName].associate) {
        loaded[modelName].associate(loaded);
      }
    });

    loaded.database = sequelize;

    return loaded;
  }
};
