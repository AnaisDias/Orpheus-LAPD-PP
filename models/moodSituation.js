'use strict';
module.exports = function(sequelize, DataTypes) {
  var MoodSituation = sequelize.define('MoodSituation', {
    situation: DataTypes.STRING,
    moodpoints: DataTypes.INTEGER,
    count: DataTypes.INTEGER
  }, {
    classMethods: {
      }
    }
  });

  return MoodSituation;
};