'use strict';
var models = require('../models');
var fs = require('fs');
var bodyParser = require('body-parser');
var moment = require('moment');

exports.file = function(req, res) {
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename) {
        //var fstream = fs.createWriteStream('./public/situman/' + filename);
        var fileData = '';
        file.on('data', function(buffer) {
	      fileData += buffer;
	    });

	    file.on('end', function(){
	    	parseSitumanData(fileData, req);
	    	res.redirect('/');
	    });

    });
    


};

function parseSitumanData(data, req){
	var obj = JSON.parse(data);
	var sdate = '';
	var ssdate = '';
	var dbdate;
	for(var myKey in obj) {
	   for(var key in obj[myKey]) {
	   	//situation numbers
	   	
	   	var situations = '';
	   	situations += JSON.stringify(obj[myKey][key]);
	   	for(var k in obj[myKey][key]){
	   		//time stamp
	   		sdate = Date.parse(obj[myKey][key].time);
	   		ssdate = JSON.stringify(obj[myKey][key].time);
	   		dbdate = moment(ssdate, "DD-MM-YYYY HH:mm:ss").format();
	   		
	   	}
	   		var situationss = JSON.parse(situations);
	   		situmanDatabaseInsert(situationss, req, dbdate);

	   }
	}
};

function situmanDatabaseInsert(situationss, req, dbdate){
	models.User.find({
	   			where: {
	   				auth_id: req.user.profile.id
	   			}
	   		}).then(function(user){
	   			var usrid = user.id;
	   				models.SituationData.findOrCreate({
		                where: {
		                    UserId: usrid,
		                    date: dbdate

		                },
		                defaults: {
		                    situations: situationss
		                }
          			  });
	   			}).catch(function(err){
	   				console.log("ERRO: "+err.message);
	   			});

}