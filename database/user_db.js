var mysql = require('mysql');
var dbconfig = require('../configuration/database');

var connection = mysql.createConnection(dbconfig.connection);

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

function createUserFitbit(role,averageDailySteps,dateOfBirth,fullName,weight,weightUnit,lastAccess){
  connection.query('\
  INSERT INTO `orpheus`.`users` \
  ( \
  `role`, \
  `averageDailySteps`, \
  `dateOfBirth`, \
  `fullName`, \
  `weight`, \
  `weightUnit`, \
  `lastAccess`) \
  VALUES  ('+role+','+averageDailySteps+','+dateOfBirth+','+fullName+','+weight+','+weightUnit+','+lastAccess+') \
  ');

}
