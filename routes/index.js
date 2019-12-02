var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

const aqiAciton = require('../controllers/aqi')

router.get('/test', aqiAciton.getAqi)

module.exports = router;
