'use strict';

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('user', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate() {
        // associations can be defined here
      }
    }
  });

  return User;
};
