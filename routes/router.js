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
    var path = require('path');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var request = require("request");
    var moment = require('moment');
    moment().format();
    var sequelize = require('sequelize');
    var bcrypt = require('bcrypt-nodejs');
    var Twitter = require('twitter');
    var unirest = require('unirest');

    var client = new Twitter({
        consumer_key: '3W9XwzPeGgTqUZebf8R8N3M22',
        consumer_secret: 'V2Hzz4MtMtaJt3sM2MLale8lXpZmxUsL8zwrx6kuPdVgGelgLp',
        access_token_key: '1898192504-6ASi0q8v0a7Ltp2fRtgj99mvX8TIfEYXA7IbFXq',
        access_token_secret: '74hhgVhgy1FtM1Jr3dN4A0isXgcv88YNksR3BSkM6YOlf'
    });

    var localAuthController = require('../controllers/local-auth');
    var FitbitAuthController = require('../controllers/fitbit-auth');
    var twitterAuthController = require('../controllers/twitter-auth');
    var dbFunctions = require('../controllers/util.js');
    var upload = require('../controllers/upload');


    module.exports = function(app) {
        var models = app.get('models');

        var id = null;

        app.get('/api/registerdate/:id', function(req, res) {
            var userid = req.params.id;
            dbFunctions.findUserById(userid).then(function(user) {
                res.json(user.createdAt);
            });

        });


        app.get('/api/username', function(req, res) {
            var json_data = null;
            if (req.user.profile == undefined) {
                json_data = {
                    username: req.user.username,
                    avatar: "http://www.fitbit.com/images/profile/defaultProfile_100_male.gif"
                }
            } else {
                json_data = {
                    username: req.user.profile.displayName,
                    avatar: req.user.profile._json.user.avatar
                };
            }
            res.json(json_data);

        });


        app.route('/fileupload')
            .post(upload.file, function(req, res) {
                updateMoodSituation(req.body.userid);
            });

        app.get('/api/getUserById/:userid', function(req, res) {

            var userid = req.params.userid;
            dbFunctions.findUserById(userid).then(function(user) {
                res.json(user);
            });
        });

        app.post('/api/insertMood', function(req, res) {
            mood = req.body.mood;
            userid = req.body.userid;
            thisdate = req.body.date;

            dbFunctions.insertMood(userid, mood, thisdate).then(function(moodDay) {
                updateMoodSituation(req.body.userid);
                res.json(moodDay);
            });

        });

        app.post('/api/insertsituationmood', function(req, res) {
            var mood = 5;
            if(req.body.mood == "good"){
                mood=10;
            }
            else if(req.body.mood == "neutral"){
                mood=5;
            }
            else if(req.body.mood == "bad"){
                mood=1;
            }
            var userid = req.body.userid;
            var situation = req.body.situation;
            var moods = 1; 

            models.MoodSituation.find({
                                        where: {
                                            UserId: userid,
                                            situation: situation
                                        }
                                    }).then(function(moodsit) {
                                        if (moodsit != null) {
                                            console.log("encontrou um mood situation para este dia e user já.");
                                            moodsit.increment('counter');
                                            var oldscore = moodsit.dataValues.moodpoints;
                                            var newscore = oldscore + mood;
                                            models.MoodSituation.update({
                                                moodpoints: newscore
                                            }, {
                                                where: {
                                                    situation: situation,
                                                    UserId: userid
                                                }
                                            });
                                            res.json({
                    message : "situation mood updated",
                    redirecturl: '/#/user?id=' + userid
                  });
                                        } else {
                                            models.MoodSituation.create({

                                                situation: situation,
                                                UserId: userid,
                                                moodpoints: mood,
                                                counter: moods
                                            });
                                            res.json({
                    message : "New situation mood created",
                    redirecturl: '/#/user?id=' + userid
                  });
                                        }
                                    });

        });

        app.get('/api/getMood/:id/:date', function(req, res) {

            userid = req.params.id;
            thisdate = req.params.date;

            dbFunctions.getMood(userid, thisdate).then(function(moodDay) {
                    res.json(moodDay);
            });
        });

        app.get('/api/getLastMoods/:id', function(req, res) {

            userid = req.params.id;

            dbFunctions.lastMoods(userid).then(function(moodDays) {
                    res.json(moodDays);
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
                console.log("user id on activity request: " + req.params.id);
                console.log("date on activity request: " + req.params.date);
                console.log(error.message);
                return res.send({
                    message: "Error retrieving activity."
                });
            });



        });

        app.get('/api/patient/list/:id', function(req, res) {
            var id_ter = req.params.id;
            var array = {
                usersArr: []
            };

            models.User.findAll({
                where: {
                    therapist: id_ter
                }
            }).then(function(users) {
                users.forEach(function(user) {
                    console.log("User");
                    console.log(user);
                    console.log(user.dataValues.username);
                    console.log(user.dataValues.id);
                    console.log(user.dataValues.fullname);
                    array.usersArr.push({
                        "username": user.dataValues.username,
                        "id": user.dataValues.id,
                        "fullname": user.dataValues.fullname,
                        "img": user.dataValues.avatar
                    });

                });
                console.log(array.toString());
                res.json(array);
            })
        });
        app.get('/api/fitbit/sleep/:date/:id', function(req, res) {
            console.log("Sending sleep request!");
            models.Sleep.find({
                where: {
                    UserId: req.params.id,
                    date: req.params.date
                }
            }).then(function(sleep) {
                res.json(sleep.content);
            }).catch(function(error) {
                console.log("user id on sleep request: " + req.params.id);
                console.log("date on sleep request: " + req.params.date);
                console.log(error.message);
                return res.send({
                    message: "Error retrieving sleep log."
                });
            });

        });


        app.get('/api/sentimentalanalysis/:id/:date', function(req, res) {
            models.User.find({
                where: {
                    id: req.params.id
                }
            }).then(function(user) {


                var params = {
                    screen_name: user.bearer
                };
                var ts = [];
                client.get('statuses/user_timeline', params, function(error, tweets, response) {
                    if (!error) {
                        for (var i in tweets) {
                            console.log("tweets are here:" + util.inspect(tweets[i].text, false, null));
                            ts.push(tweets[i].text);
                        }
                    }

                    var counterPos = 0;
                    var counterNeg = 0;

                    var itemsProcessed = 0;
                    ts.forEach(function(tweet) {
                        unirest.post("https://twinword-sentiment-analysis.p.mashape.com/analyze/")
                            .header("X-Mashape-Key", "huDuunzqEXmshFHOpfPv3vaO9RdYp1K9sc0jsnMkFVRl4DlqEq")
                            .header("Content-Type", "application/x-www-form-urlencoded")
                            .header("Accept", "application/json")
                            .send("text=" + tweet)
                            .end(function(result) {
                                console.log("Tweet result: " + result.body.type);
                                if (result.body.type == "positive") {
                                    counterPos++;
                                } else if (result.body.type == "negative") {
                                    counterNeg++;
                                }
                                itemsProcessed++;
                                if (itemsProcessed === ts.length) {
                                    var response = {
                                        'positive': counterPos,
                                        'negative': counterNeg
                                    };
                                    res.send(response);
                                }

                            });
                    });

                });
            });
        });

        var toCheck = function(thisdate, userid, auth_id, accessToken) {
                var datetoday = moment();
                var thisdateMoment = moment(thisdate);
                models.Activity.count({
                    where: {
                        date: thisdate,
                        UserId: userid
                    }
                }).then(count => {
                    if (count != 0 && !(thisdateMoment.isSame(datetoday, 'day'))) {
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
                        if (thisdateMoment.isSame(datetoday, 'day')) {
                            models.Activity.findOne({
                                where: {
                                    date: thisdate,
                                    UserId: userid
                                }
                            }).then(function(activity) {
                                request(optionsAct, function(error, response, body) {
                                    if (!activity) {
                                        models.Activity.create({
                                            date: thisdate,
                                            UserId: userid,
                                            content: body
                                        });
                                    } else {
                                        models.Activity.update({
                                            content: body
                                        }, {
                                            where: {
                                                date: thisdate,
                                                UserId: userid
                                            }
                                        }).then(function(activity) {
                                            return;
                                        });
                                    }
                                });


                            });

                        } else {
                            request(optionsAct, function(error, response, body) {

                                models.Activity.create({

                                    date: thisdate,
                                    UserId: userid,
                                    content: body
                                });
                            });
                        }

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

                            models.Sleep.create({
                                date: thisdate,
                                UserId: userid,
                                content: body
                            }).catch(function(error) {
                                console.log("Erro ao gravar sleep log: " + error.message);
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
                models.User.findById(id).then(function(user) {
                    models.User.update({
                        auth_id: req.user.profile.id,
                        avatar: req.user.profile._json.user.avatar,
                        displayName: req.user.profile._json.user.displayName,
                        gender: req.user.profile._json.user.gender,
                        age: req.user.profile._json.user.age
                    }, {
                        where: {
                            id: user.id
                        }
                    }).then(function(u) {
                        models.User.find({
                            where: {
                                auth_id: req.user.profile.id
                            }
                        }).then(function(user) {
                            console.log(user);
                            parseDate = user.createdAt.setMonth(user.createdAt.getMonth());
                            var momentRegisterDate = moment(parseDate);
                            var momentToday = moment();

                            //cycle that requests activity and stores it from registration date untill today, adding one day after each iteration
                            while (momentRegisterDate.isSameOrBefore(momentToday)) {
                                var thisdate = momentRegisterDate.year() + "-" + (momentRegisterDate.month() + 1) + "-" + momentRegisterDate.date();
                                toCheck(thisdate, user.id, user.auth_id, req.user.accessToken);
                                momentRegisterDate.add(1, 'days');
                            }

                            if (user.type == 1) {
                                res.redirect('/#/therapist?id=' + user.id);
                            } else {
                                res.redirect('/#/user?id=' + user.id);
                            }
                        })
                    });
                });


            });

        app.get('/auth/twitter', passport.authenticate('twitter'));

        app.get('/auth/twitter/callback', passport.authenticate('twitter', {
            failureRedirect: '/api/logout'
        }), function(req, res) {

            if (id != null) {
                models.User.findById(id).then(function(user) {
                    models.User.update({
                        bearer: req.user.username
                    }, {
                        where: {
                            id: user.id
                        }
                    });
                });
                res.redirect('/auth/fitbit');
            } else {
                res.redirect('/api/logout');
            }
        });

        //login in our application
        //login in our application

        app.post('/api/login', function(req, res, next) {

            passport.authenticate('user-local', function(err, user, info) {

                var error = err || info;
                if (error) {
                    console.log("Error");
                    var json_data = {
                        success: false
                    };
                    return res.send(json_data);
                }

                req.logIn(user, function(err) {
                    console.log(err);
                    console.log("Success");
                    console.log(req.user);
                    if (err) return res.send(err);
                    var json_data = {
                        success: true,
                        fullname: req.user.fullname,
                        username: req.user.username,
                        id: req.user.id,
                        type: req.user.type
                    };
                    id = req.user.id;
                    console.log("\n\n\n\nREQ LOCAL: \n" + id);
                    res.json(json_data);
                });
            })(req, res, next);
        });

        app.post('/api/register', function(req, res) {

            var nusername = req.body.username;
            var name = req.body.fullname;
            var nemail = req.body.email;
            var npassword = req.body.password;
            var rPassword = req.body.rPassword;
            var ntype = req.body.type;


            if (npassword == rPassword) {
                var hashPass = bcrypt.hashSync(npassword, bcrypt.genSaltSync(8), null);
                models.User.find({
                    where: {
                        $or: [{
                            username: nusername
                        }, {
                            email: nemail
                        }]
                    }
                }).then(function(user) {
                        if (user != null) {
                            var json_data = {
                                success: false,
                                exists: true
                            };
                            res.json(json_data);
                        } else {
                            models.User.create({
                                username: nusername,
                                email: nemail,
                                fullname: name,
                                password: hashPass,
                                type: ntype
                            }, {
                                fields: ['username', 'email', 'fullname', 'password', 'type']
                            }).then(function(user) {
                                var json_data = {
                                    success: true
                                };
                                res.json(json_data); // => { username: 'barfooz', isAdmin: false }
                            });
                        }
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

        app.get('/api/checkLogin', function(req, res) {

            var json_data;
            if (req.isAuthenticated()) {
                models.User.find({
                    where: {
                        auth_id: req.user.profile.id
                    }
                }).then(function(user) {
                    json_data = {
                        'id': user.id,
                        'type': user.type
                    }
                    if (id == null || id != user.id) {
                        id = user.id
                    }
                    res.send(json_data);
                });


            } else {
                res.send('undefined');
            }
        });

        var util = require('util');
        app.get('/api/situationData/:date/:id', function(req, res) {

            var date = req.params.date;
            var id = req.params.id;
            var dbdate = moment(date, "DD-MM-YYYY").date();
            var dbmonth = moment(date, "DD-MM-YYYY").month() + 1;
            var dbyear = moment(date, "DD-MM-YYYY").year();
            var results = [];
            var situ = [];
            var found = false;
            var size = 0;
            var data = '{\n';
            var totalcount = 0;

            /*models.User.find({
                where: {
                    auth_id: req.user.profile.id
                }
            }).then(function(user){*/
            models.sequelize.query('SELECT situations FROM public."SituationData" WHERE extract(year from date) = ? AND extract(month from date) = ? AND extract(day from date) = ? AND "SituationData"."UserId" = ? ', {
                    replacements: [dbyear, dbmonth, dbdate, id],
                    type: sequelize.QueryTypes.SELECT
                })
                .then(function(users) {
                    console.log(users);
                    results = users;
                    for (var r in results) {
                        for (var situations in results[r]) {
                            for (var l in results[r][situations]) {
                                if (results[r][situations][l].name != undefined) {
                                    for (var names in situ) {
                                        if (results[r][situations][l].name == situ[names].name) {
                                            situ[names].count += 1;
                                            totalcount += 1;
                                            found = true;
                                            break;
                                        }
                                    }

                                    if (!found) {
                                        situ[size] = [];
                                        situ[size].name = results[r][situations][l].name;
                                        situ[size].count = 1;
                                        totalcount += 1;
                                        size += 1;
                                    }
                                }
                            }
                        }

                    }

                    for (var x in situ) {

                        var percentage = Math.round((situ[x].count / totalcount) * 100 * 10) / 10;
                        data += '\"' + situ[x].name + '\": ' + '\"' + percentage + '\"';
                        if (x < situ.length - 1) {
                            data += ',\n';
                        }
                    }
                    data += '\n}';
                    data = JSON.parse(data);
                    res.json(data);
                }).catch(function(err) {
                    console.log("ERRO: " + err.message);
                });


        });

        //use in api function and every time moods or situations are updated
        var updateMoodSituation = function(id) {
            var size = 0;
            var situ = [];
            var dates = [];

            models.SituationData.findAll({
                where: {
                    UserId: id
                }
            }).then(function(sits) {
                sits.forEach(function(r) {
                    console.log("Results: " + util.inspect(r.dataValues, false, null));
                    var date = r.dataValues.date;
                    var moodscore = 0;
                    var situations = r.dataValues.situations;
                    var found = false;

                    if (dates.indexOf(date) == -1) {
                        dates.push(date);
                        models.MoodDay.find({
                            attributes: ['score'],
                            where: {
                                date: date
                            }
                        }).then(function(moods) {
                            if (moods != null) {
                                moodscore = moods.score;
                                console.log('Moodscore: ' + moodscore);
                                for (var s in situations) {
                                    console.log("SITUATIONS: " + util.inspect(situations, false, null));

                                    if (situations[s].name != undefined) {

                                        found = false;
                                        for (var names in situ) {
                                            if (situations[s].name == situ[names].name) {
                                                situ[names].moodscore += moodscore;
                                                situ[names].moods += 1;
                                                found = true;
                                                break;
                                            }
                                        }

                                        if (!found) {
                                            situ[size] = [];
                                            situ[size].name = situations[s].name;
                                            situ[size].moodscore = moodscore;
                                            situ[size].moods = 1;
                                            size += 1;
                                        }
                                        console.log("SITU: " + util.inspect(situ, false, null));
                                    }
                                }
                                //save results to db
                                for (var i in situ) {
                                    var name = situ[i].name;
                                    var score = situ[i].moodscore;
                                    var moods = situ[i].moods;
                                    console.log("Situation: " + name + " Score: " + score);

                                    models.MoodSituation.find({
                                        where: {
                                            UserId: id,
                                            situation: name
                                        }
                                    }).then(function(moodsit) {
                                        if (moodsit != null) {
                                            console.log("encontrou um mood situation para este dia e user já.");
                                            moodsit.increment('counter');
                                            var oldscore = moodsit.dataValues.moodpoints;
                                            var newscore = oldscore + score;
                                            models.MoodSituation.update({
                                                moodpoints: newscore
                                            }, {
                                                where: {
                                                    situation: name,
                                                    UserId: id
                                                }
                                            });
                                        } else {
                                            models.MoodSituation.create({

                                                situation: name,
                                                UserId: id,
                                                moodpoints: score,
                                                counter: moods
                                            });


                                        }
                                    });
                                }
                            }

                        }).catch(function(err) {
                            console.log("ERROR getting moods: " + err);

                        });

                    }
                });

            }).catch(function(err) {
                console.log("ERROR getting situations: " + err);
            });
        }

        app.get('/api/moodsituation/:id', function(req, res) {

            var id = req.params.id;
            var data = '';
            var counter = 1;

            models.MoodSituation.findAll({
                where: {
                    UserId: id
                },
                order: [
                    ['moodpoints', 'DESC']
                ]
            }).then(function(moodsituation) {
                data = '{ ';
                if (moodsituation.length == 0) {
                    updateMoodSituation(id);
                }
                moodsituation.forEach(function(i) {
                    data += '"' + counter + '": {\n "situation": "' + i.dataValues.situation + '",\n"score": "' + i.dataValues.moodpoints + '",\n"moods": "' + i.dataValues.counter + '"\n}';

                    if (counter < moodsituation.length) {
                        data += ',\n';
                    } else {
                        data += '\n}';
                    }
                    counter += 1;

                });


                //data = JSON.parse(data);
                res.json(data);
            }).catch(function(err) {
                console.log("ERROR getting mood situations: " + err);
                updateMoodSituation(id);
                data = {
                    success: false
                };
                res.json(data);
            });

        });

        app.get('/api/logout', function(req, res) {
            console.log("Logging out");
            req.session = null;
            id = null;
            req.logout();
            res.redirect('/#/login');

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
