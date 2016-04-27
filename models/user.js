'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    fullname: DataTypes.STRING,
    avatar: DataTypes.STRING,
    displayName: DataTypes.STRING,
    gender: DataTypes.STRING,
    age: DataTypes.INTEGER,
    auth_id: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};