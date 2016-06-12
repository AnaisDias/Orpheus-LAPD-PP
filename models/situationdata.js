'use strict';
module.exports = function(sequelize, DataTypes) {
  var SituationData = sequelize.define('SituationData', {
    date: DataTypes.DATE,
    situations: DataTypes.JSONB
  }, {
    classMethods: {
      associate: function(models) {
        SituationData.belongsTo(models.User);
      }
    }
  });

  return SituationData;
};