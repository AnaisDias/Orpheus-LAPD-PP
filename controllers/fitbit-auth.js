var passport = require('passport');
var request = require("request");
var fitbit_accessToken, fitbit_refreshToken, fitbit_profile;
var FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy;

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
  done(null, {
    accessToken: accessToken,
    refreshToken: refreshToken,
    profile: profile
  });
}
));
