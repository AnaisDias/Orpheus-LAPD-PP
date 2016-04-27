'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require('../config/config.json');
var db        = {};

console.log("MERDA222");

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
  console.log("MERDA2");
} else {
  var sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, config.development);
  console.log("MERDA");
  console.log("pPASSSSSSSSS  " + config.development.password);

  console.log("confiiiiiiiiiig " + JSON.stringify(config));
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

if(db){
  console.log("db existe");
}


module.exports = db;
