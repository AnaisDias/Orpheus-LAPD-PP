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

    var FitbitAuthController = require('../controllers/fitbit-auth');


    module.exports = function(app) {

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

            models.User.find({
                where: {
                    id: req.params.id
                }
            }).then(function(user) {
                var url1 = "https://api.fitbit.com/1/user/" + user.auth_id + "/activities/date/" + req.params.date + ".json";
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

        // OAuth routes
        app.get('/auth/fitbit', passport.authenticate('fitbit', {
            scope: ['weight', 'profile', 'activity', 'heartrate', 'sleep']
        }));
        app.get('/auth/fitbit/callback', passport.authenticate('fitbit'),
            function(req, res) {
                console.log(req);
                // If this function gets called, authentication was successful.
                // `req.user` contains the authenticated user.

                models.User.find({
                    where: {
                        auth_id: req.user.profile.id
                    }
                }).then(function(user) {

                    console.log("fuuuuuuck " + user.id)
                    res.redirect('/#/user?id=' + user.id);
                });

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
