var passport = require('passport');
var TwitterStrategy = require('passport-twitter');

var models = require('../models');

var TwitterProfile, Token;

passport.use(new TwitterStrategy({
        consumerKey: "3W9XwzPeGgTqUZebf8R8N3M22",
        consumerSecret: "V2Hzz4MtMtaJt3sM2MLale8lXpZmxUsL8zwrx6kuPdVgGelgLp",
        callbackURL: "/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {
        /*TwitterProfile = JSON.stringify(profile);
        Token = token;
        console.log("\nTwitter profile:::::::::::::::::::::::::::::::::\n" );
        console.log(TwitterProfile);
        console.log(TwitterProfile.photos);
        /*models.User.findOrCreate({
            where: {twitter_id: profile.id},
            defaults: {fullname: TwitterProfile._json.user.name, avatar: TwitterProfile._json.user.avatar, displayName: TwitterProfile._json.user.displayName, gender: "M", age: 20}
        });*/
        process.nextTick (function () {
            return done ( null, profile );
        });
    }
));