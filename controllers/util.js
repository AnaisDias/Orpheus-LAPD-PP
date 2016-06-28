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


}());
