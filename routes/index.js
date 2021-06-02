var express = require('express');
var router = express.Router();
const path = require('path');
const db = require('better-sqlite3')('articles.db');


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.sessionID != undefined) {
    res.redirect('/menu');
  }

  res.sendFile(path.join(__dirname+'/../views/login.html'));
});

router.get('/menu', function(req, res, next) {
  console.log(req.session)
    if(req.session.sessionID == undefined) {
      res.write('<h1>Please login first.</h1>');
      res.end('<a href='+'/'+'>Login</a>');
    }
  res.sendFile(path.join(__dirname+'/../views/menu.html'));
});

router.get('/level/:num', function(req, res, next) {
  if(req.session.sessionID == undefined) {
    res.write('<h1>Please login first.</h1>');
    res.end('<a href='+'/'+'>Login</a>');
  }
  if(req.params.num > 3 || req.params.num < 1)
    res.send("Sry but this level dosnt exist :/")
    
  res.sendFile(path.join(__dirname+'/../views/Level/'+req.params.num+'.html'));
});

router.get('/articles', function(req, res, next) {  
  res.sendFile(path.join(__dirname+'/../views/index.html'));
});

module.exports = router;
