'use strict';
module.exports = function(sequelize, DataTypes) {
  var MoodSituation = sequelize.define('MoodSituation', {
    situation: DataTypes.STRING,
    moodpoints: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        MoodSituation.belongsTo(models.User);
      }
      }
    
  });

  return MoodSituation;
};