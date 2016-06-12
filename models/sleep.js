'use strict';
module.exports = function(sequelize, DataTypes) {
        var Sleep = sequelize.define('Sleep', {
                date: DataTypes.DATEONLY,
                content: DataTypes.JSON
            }, {
                classMethods: {
                    associate: function(models) {
                        Sleep.belongsTo(models.User, {
                                onDelete: "CASCADE",
                                foreignKey: {
                                    allowNull: false
                                }
                            });
                        }
                    }
                });
            return Sleep;
        };
