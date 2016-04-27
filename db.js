var Sequelize = require('sequelize');

var sequelize = new Sequelize('orpheus', 'root', 'root', {
    host: '127.0.0.1',
    dialect: 'mysql',
    port: 3306,

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    define: {
        timestamps: false
    }
});

var db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
