(function() {
    var models = require('../models');
    var sequelize = require('sequelize');
    var Promise = require('bluebird');

    exports.findUserById = function(userid) {
        return new Promise(function(resolve, reject) {
            models.User.find({
                where: {
                    id: userid
                }
            }).then(function(user) {
                resolve(user);

            });
        });
    }

    exports.insertMood = function(userid, mood, thisdate) {

      console.log("DATA ECEBIIIIDA                   "+thisdate);
        return new Promise(function(resolve, reject) {
            models.MoodDay.count({
                where: {
                    UserId: userid,
                    date: thisdate
                }
            }).then(count => {
                if (count != 0) {
                  console.log("encontrou um mood para este dia e user já.");
                    models.MoodDay.update({
                        score: mood
                    }, {
                        where: {
                            date: thisdate,
                            UserId: userid
                        }
                    }).then(function(moodDay) {
                        resolve(moodDay);
                    });
                } else {
                    models.MoodDay.create({

                        date: thisdate,
                        UserId: userid,
                        score: mood
                    }).then(function(moodDay) {
                        resolve(moodDay);
                    });


                }

            });
        });
    }

      exports.getMood = function(userid, thisdate) {
          return new Promise(function(resolve, reject) {

            models.MoodDay.find({
                where: {
                    UserId: userid,
                    date: thisdate
                }
            }).then(function(moodDay){
              console.log("MOOOOD                                     "+moodDay.score);
              resolve(moodDay);
            });
          });
      }


}());
