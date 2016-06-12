(function() {

    var express = require('express');
    var CircularJSON = require('circular-json');
    var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var cookieParser = require('cookie-parser');
    var cookieSession = require('cookie-session');
    var session = require('express-session');
    var passport = require('passport');
    var OAuth = require('oauth');
    var FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy;
    var mysql = require("mysql");
    var path = require('path');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var request = require("request");
    var models = require('../models');
    var moment = require('moment');
    moment().format();
    var crypto = require('crypto');

    var FitbitAuthController = require('../controllers/fitbit-auth');


    module.exports = function(app) {
        var models = app.get('models');
        app.post('/api/fitbit/user/findorcreate', function(req, res) {

            models.User.findOrCreate({
                where: {
                    auth_id: req.body.auth_id
                }, // we search for this user
                defaults: {
                    fullname: req.body.fullname,
                    avatar: req.body.avatar,
                    displayName: req.body.displayName,
                    gender: req.body.gender,
                    age: req.body.age
                }
            });

            console.log(req.body.fullname);
        });


        app.get('/api/username', function(req, res) {

            var json_data = {
                username: req.user.profile.displayName,
                avatar: req.user.profile._json.user.avatar
            };
            res.json(json_data);
            //console.log(JSON.stringify(req.user));

        });

        app.get('/api/getUserById/:userid', function(req, res) {
            console.log(req.params);

            var userid = req.params.userid;
            models.User.find({
                where: {
                    id: userid
                }
            }).then(function(user) {

                res.json(user)
            });
        });

        app.get('/api/fitbit/activity/:date/:id', function(req, res) {
            console.log("Sending activity request!");
            models.Activity.find({
                where: {
                    UserId: req.params.id,
                    date: req.params.date
                }
            }).then(function(activity) {
                    res.json(activity.content);
            }).catch(function(error) {
              console.log("user id on activity request: "+req.params.id);
              console.log("date on activity request: "+req.params.date);
              console.log(error.message);
                return res.send({
                    message: "Error retrieving activity."
                });
            });



        });


        app.get('/api/fitbit/sleep/:date/:id', function(req, res) {
            console.log("Sending sleep request!");

            console.log(req.params);

            console.log(JSON.stringify(req.user.accessToken));

            models.User.find({
                where: {
                    id: req.params.id
                }
            }).then(function(user) {
                var url1 = "https://api.fitbit.com/1/user/" + user.auth_id + "/sleep/date/" + req.params.date + ".json";
                var fitAuth = "Bearer " + req.user.accessToken;
                var options = {
                    url: url1,
                    headers: {
                        'Authorization': fitAuth
                    }
                };
                console.log(options.url);
                console.log(options.headers.Authorization);
                request(options, function(error, response, body) {
                    console.log(body); // Show the HTML for the Google homepage.
                    var json_data = {
                        summary: body
                    };
                    res.json(body);
                });
            });

        });

        app.get('/api/logout', function(req, res) {
            console.log("Logging out");
            req.session = null;
            req.logout();
            var json_data = {
                response: "0k"
            };
            res.json(json_data);
        });

        var toCheck = function(thisdate, userid, auth_id, accessToken) {
                models.Activity.count({
                    where: {
                        date: thisdate,
                        UserId: userid
                    }
                }).then(count => {
                    if (count != 0) {
                        console.log("ENONTROOOOOOOOU " + thisdate);
                    } else {
                        console.log("NAAAAAAAAAAAAAAAAOy " + thisdate);

                        console.log("sending activity request for " + thisdate);
                        var urlAct = "https://api.fitbit.com/1/user/" + auth_id + "/activities/date/" + thisdate + ".json";
                        var fitAuth = "Bearer " + accessToken;
                        var optionsAct = {
                            url: urlAct,
                            headers: {
                                'Authorization': fitAuth
                            }
                        };
                        request(optionsAct, function(error, response, body) {

                            models.Activity.create({

                                date: thisdate,
                                UserId: userid,
                                content: body

                            });


                        });

                        console.log("sending sleep request for " + thisdate);
                        var urlSleep = "https://api.fitbit.com/1/user/" + auth_id + "/sleep/date/" + thisdate + ".json";
                        var fitAuth = "Bearer " + accessToken;
                        var optionsSleep = {
                            url: urlSleep,
                            headers: {
                                'Authorization': fitAuth
                            }
                        };
                        request(optionsSleep, function(error, response, body) {

                            models.Sleep.findOrCreate({
                                where: {
                                    date: thisdate
                                }, // we search for this user
                                defaults: {
                                    content: body,
                                    UserId: userid
                                }
                            });


                        });
                    }
                });
            }
            // OAuth routes
        app.get('/auth/fitbit', passport.authenticate('fitbit', {
            scope: ['weight', 'profile', 'activity', 'heartrate', 'sleep']
        }));
        app.get('/auth/fitbit/callback', passport.authenticate('fitbit'),
            function(req, res) {
                // If this function gets called, authentication was successful.
                // `req.user` contains the authenticated user.

                models.User.find({
                    where: {
                        auth_id: req.user.profile.id
                    }
                }).then(function(user) {
                    parseDate = user.createdAt.setMonth(user.createdAt.getMonth());
                    var momentRegisterDate = moment(parseDate);
                    var momentToday = moment();

                    //cycle that requests activity and stores it from registration date untill today, adding one day after each iteration
                    while (momentRegisterDate.isSameOrBefore(momentToday)) {
                        var thisdate = momentRegisterDate.year() + "-" + (momentRegisterDate.month() + 1) + "-" + momentRegisterDate.date();
                        console.log(thisdate);
                        toCheck(thisdate, user.id, user.auth_id, req.user.accessToken);
                        momentRegisterDate.add(1, 'days');
                    }

                    res.redirect('/#/user?id=' + user.id);
                });

            });

        //login in our application

        app.post('/api/login', function(req, res) {
            var username = req.body.username;
            var password = req.body.password;
        });

        //register in our application
        app.post('/api/register', function(req, res) {

            var nusername = req.body.username;
            var name = req.body.fullname;
            var nemail = req.body.email;
            var npassword = req.body.password;
            var rPassword = req.body.rPassword;

            var secret = "orpheusapp";


            if (npassword == rPassword) {
                var hashPass = crypto.createHmac('sha256', secret)
                    .update(npassword)
                    .digest('hex');
                console.log(hashPass);
                models.usertest.find({
                    where: {
                        $or: [{
                            username: nusername
                        }, {
                            email: nemail
                        }]
                    }
                }).then(function(user) {
                        console.log(user);
                        if (user != null) {
                            var json_data = {
                                success: false,
                                exists: true
                            };
                            console.log("not null");
                        } else {
                            models.usertest.create({
                                username: nusername,
                                email: nemail,
                                fullname: name,
                                password: hashPass
                            }, {
                                fields: ['username', 'email', 'fullname', 'password']
                            }).then(function(user) {
                                console.log(user.get({
                                        plain: true
                                    })) // => { username: 'barfooz', isAdmin: false }
                            });
                            var json_data = {
                                success: true
                            };
                        }
                        res.json(json_data);
                    },
                    function(err) {
                        var json_data = {
                            success: false
                        };
                        res.json(json_data);
                    });

            } else {

                var json_data = {
                    success: false
                };
                res.json(json_data);
            }

        });


        app.get('*', function(req, res) {
            res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
        });

        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // error handlers

        // development error handler
        // will print stacktrace
        if (app.get('env') === 'development') {
            app.use(function(err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });


    }

}());
