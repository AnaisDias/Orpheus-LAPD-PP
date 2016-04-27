var passport = require('passport');
var request = require("request");
var fitbit_accessToken, fitbit_refreshToken, fitbit_profile;
var FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy;

var models = require('../models');

// Configure Passport session management to use the Fitbit user
// These de/serialize functions work for this hack but are not
// well suited for "real world" apps because you'd want to persist
// the user's session across multiple Node instances and app reboots
passport.serializeUser(function(user, done) {
   console.log("serialize user", user);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  // console.log("deserialize obj", obj);
  done(null, obj);
});

passport.use(new FitbitStrategy({
	clientID:     "227L7D",
	clientSecret: "7723212530771cafa5f2514b9aee8a54",
	callbackURL: "http://127.0.0.1:8000/auth/fitbit/callback"
},
function(accessToken, refreshToken, profile, done) {
  console.log("egrfdse");
  fitbit_accessToken=accessToken;
  fitbit_refreshToken=refreshToken;
  fitbit_profile=profile;
  console.log(fitbit_profile);

  models.User.findOrCreate({
		where: { auth_id: fitbit_profile.id}, // we search for this user
		defaults: {fullname: fitbit_profile._json.user.fullName, avatar: fitbit_profile._json.user.avatar, displayName: fitbit_profile._json.user.displayName, gender: fitbit_profile._json.user.gender, age: fitbit_profile._json.user.age}});



	console.log("auth id: "+fitbit_profile.id);
  console.log(JSON.stringify(fitbit_profile._json.user.displayName));
  done(null, {
    accessToken: accessToken,
    refreshToken: refreshToken,
    profile: profile
  });
}
));
