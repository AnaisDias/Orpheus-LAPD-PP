'use strict';
module.exports = function(sequelize, DataTypes) {
  var MoodDay = sequelize.define('MoodDay', {
    date: DataTypes.DATEONLY,
    score: DataTypes.INTEGER,
    updatedAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {

        MoodDay.belongsTo(models.User, {
                onDelete: "CASCADE",
                foreignKey: {
                    allowNull: false
                }
            });

      }
    }
  });
  return MoodDay;
};
