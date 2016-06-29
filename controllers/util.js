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
        return new Promise(function(resolve, reject) {
            models.MoodDay.findOne({
                where: {
                    UserId: userid,
                    date: thisdate
                }
            }).then(function(moodDay) {
                if (moodDay===null) {
                    models.MoodDay.create({

                        date: thisdate,
                        UserId: userid,
                        score: mood
                    }).then(function(moodDay) {
                        resolve(moodDay);
                    });
                } else {
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

                }

            });
        });
    }


}());
