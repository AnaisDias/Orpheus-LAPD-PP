var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/dashboard', function(req, res, next) {
  res.send('dashboard', { title: 'Stats' });
});

module.exports = router;
