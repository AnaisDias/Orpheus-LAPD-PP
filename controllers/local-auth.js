var Models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

passport.use('user-local', new LocalStrategy({
        usernameField: 'user',
        passwordField: 'pass' // this is the virtual field on the model
    },
    function(username, password, done) {
        console.log(username);

        console.log(password);

        Models.User.findOne({
            where: {
                username: username
            }
        }).then( function(user) {
            console.log("User\n" + user.username + "\nfull name\n" + user.fullname);
            if (!user) {
                return done(null, false, {
                    message: 'This username is not registered.'
                });
            }
            if (!bcrypt.compareSync(password,user.password)) {
                console.log("passwords not match");
                return done(null, false, {
                    message: 'This password is not correct.'
                });
            }
            console.log("Calling done!");
            return done(null, user);
        });
    }
));