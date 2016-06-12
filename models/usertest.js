'use strict';
module.exports = function(sequelize, Sequelize) {
  var UserTest = sequelize.define('usertest', {
    id: {type: Sequelize.INTEGER,
          primaryKey: true},
    fullname: Sequelize.STRING,
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return UserTest;
};