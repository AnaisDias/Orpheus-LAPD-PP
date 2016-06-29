'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    fullname: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    type: DataTypes.INTEGER, // 1 is therapist, 0 is normal user
    therapist: DataTypes.INTEGER,
    avatar: DataTypes.STRING,
    displayName: DataTypes.STRING,
    gender: DataTypes.STRING,
    age: DataTypes.INTEGER,
    auth_id: DataTypes.STRING,
    bearer: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Activity, {as: 'Activities'});
        User.hasMany(models.Sleep, {as: 'SleepLogs'})
      }
    }
  });
  return User;
};
