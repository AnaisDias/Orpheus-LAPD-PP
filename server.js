
// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express

var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var OAuth = require('oauth');
var TwitterStrategy = require('passport-twitter').Strategy;
var FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy;
var config = require('./configuration/config');
var mysql = require("mysql");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var request = require("request");

var routes = require('./routes/index');
var users = require('./routes/users');

// Initialize controllers
var IndexController = require('./controllers/index'),
	FitbitAuthController = require('./controllers/fitbit-auth'),
	FitbitApiController = require('./controllers/fitbit-api');

// configuration =================
app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);




app.get('/api/todos', function(req, res) {
	var json_data = {"name":"amita","pass":"12345"};
	res.json(json_data);

});

// OAuth routes
app.get('/auth/fitbit', passport.authenticate('fitbit', {scope: ['weight', 'profile', 'activity','heartrate']}));
app.get( '/auth/fitbit/callback', passport.authenticate( 'fitbit', {
        successRedirect: '/#/dashboard',
        failureRedirect: '/#/login'
}));




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

/*
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "orpheus"
});


con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

//Example of database acces
con.query('SELECT * FROM user',function(err,rows){
  if(err) throw err;

  console.log('Data received from Db:\n');
  //may be useful for testing:
  console.log(JSON.stringify(rows));

  //accessing columns from the rows:
  for (var i = 0; i < rows.length; i++) {
    console.log(rows[i].firstname);
  };

});

con.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
});

*/

module.exports = app;

app.listen(8000);
console.log("App listening on port 8000");
