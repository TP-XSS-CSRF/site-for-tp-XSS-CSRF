
var express = require('express');
var router = express.Router();
const path = require('path');
const db = require('better-sqlite3')('articles.db');
var app = express();
const TokenGenerator = require('uuid-token-generator');


/* GET home page. */
var sess; // global session, NOT recommended

router.get('/articles/delete', function(req, res, next) {
    const rdyToRun = db.prepare("DELETE FROM article WHERE user = ?").run(req.session.sessionID);
    res.send("RESET SUCCEED !")
})

router.post('/article/add', function(req, res, next) {
    if(req.body.title === undefined || req.body.desc === undefined)
        res.send("Sry but you need to give 2 param exactly")

    const rdyToRun = db.prepare("INSERT INTO article (title, description, user) VALUES (?,?,?)");
    const article = [req.body.title, req.body.desc, req.session.sessionID];

  rdyToRun.run(article)

  res.redirect("back")
})

router.get("/articles/all", function (req, res, next) {
  res.json(db.prepare("SELECT title, description FROM article WHERE user= ? OR user=all").all(req.session.sessionID))
})

router.post('/user/add', function(req, res, next) {
    if(req.body.username === undefined)
        res.send("Sry but you need to give an username !")
    const tokgen = new TokenGenerator(); // Default is a 128-bit token encoded in base58
    const token = tokgen.generate();
    const rdyToRun1 = db.prepare("SELECT * FROM user where username = ?");

    if(rdyToRun1.get(req.body.username) != undefined)
        res.redirect('/menu');

    const rdyToRun2 = db.prepare("INSERT INTO user (username, sessionToken) VALUES (?,?)");
    const user2 = [req.body.username, token];
    rdyToRun2.run(user2);

    sess = req.session;
    sess.sessionID = token;

    res.redirect('/menu');
});


router.get('/articles/all', function(req, res, next) {
    console.log(db.prepare("SELECT title, description FROM article WHERE user='all'").all())
    res.json(db.prepare("SELECT title, description FROM article WHERE user = ? OR user='all'").all(req.session.sessionID));
});

module.exports = router
