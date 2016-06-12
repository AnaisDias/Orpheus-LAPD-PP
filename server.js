// set up ========================
var express = require('express');
var app = express(); // create our app w/ express
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
app.set('models', require('./models'));
var models = app.get('models');

// Initialize controllers
var FitbitAuthController = require('./controllers/fitbit-auth');

// configuration =================
app.use(logger('dev'));
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}));
app.use(passport.initialize());
app.use(passport.session());

require('./routes/router')(app);

app.set('port', process.env.PORT || 8000);

models.sequelize.sync().then(function () {
  var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
  });
});

module.exports = app;
