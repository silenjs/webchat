var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Nodejs Express Socket.io' });
});
router.get('/err',function(req,res,next){
  res.render('layout')
})
module.exports = router;
