var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard', function(req, res, next) {
  console.log('the response will be sent by the next function ...');
  res.render('dashboard', { title: 'Stats' });
});

module.exports = router;
