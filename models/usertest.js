'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserTest = sequelize.define('UserTest', {
    fullname: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return UserTest;
};