'use strict';
module.exports = function(sequelize, DataTypes) {
        var Activity = sequelize.define('Activity', {
                date: DataTypes.DATEONLY,
                content: DataTypes.JSONB
            }, {
                classMethods: {
                    associate: function(models) {
                        Activity.belongsTo(models.User, {
                                onDelete: "CASCADE",
                                foreignKey: {
                                    allowNull: false
                                }
                            });
                        }
                    }
                });
            return Activity;
        };
