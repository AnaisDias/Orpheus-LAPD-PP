console.log("egfd");

var mysql = require('mysql');
var dbconfig = require('../configuration/database');

var connection = mysql.createConnection(dbconfig.connection);

console.log("connection to" + dbconfig.connection.database);

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});



connection.query('\
CREATE TABLE `roles` ( \
  `idroles` int(11) NOT NULL, \
  `name` varchar(30) DEFAULT NULL, \
  PRIMARY KEY (`idroles`) \
) ENGINE=InnoDB DEFAULT CHARSET=utf8;');


connection.query('\
CREATE TABLE `users` ( \
    `iduser` int(11) NOT NULL AUTO_INCREMENT, \
    `role` int(11) NOT NULL, \
    `averageDailySteps` int(11) DEFAULT NULL, \
    `dateOfBirth` date DEFAULT NULL, \
    `fullName` varchar(45) DEFAULT NULL, \
    `weight` int(11) DEFAULT NULL, \
    `weightUnit` varchar(45) DEFAULT NULL, \
    `email` varchar(45) DEFAULT NULL, \
    `lastAccess` datetime DEFAULT NULL, \
    PRIMARY KEY (`iduser`), \
    KEY `role_idx` (`role`), \
    CONSTRAINT `role` FOREIGN KEY (`role`) REFERENCES `roles` (`idroles`) ON DELETE CASCADE ON UPDATE CASCADE \
) ENGINE=InnoDB DEFAULT CHARSET=utf8;');
