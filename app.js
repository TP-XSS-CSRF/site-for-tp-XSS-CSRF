
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const Database = require('better-sqlite3');
var cors = require('cors')
const bodyParser = require('body-parser');

var session = require('express-session')

var indexRouter = require('./routes/index');
var repoRouter = require('./routes/repository');

var app = express();

app.use(cors())
app.use(session({
  secret: 'ssshhhhh',
  saveUninitialized: true,
  resave: true,
  cookie: {
    httpOnly: false,
    sameSite: false
  },}));


const dropTableArticle = "DROP TABLE IF EXISTS article;";
const dropTableUser = "DROP TABLE IF EXISTS user;";
const createTableArticle = "CREATE TABLE article ('title' varchar, 'description' varchar, 'user' varchar);"
const createTableUser = "CREATE TABLE user ('username' varchar, 'sessionToken' varchar);"


const db = new Database("articles.db", { verbose: console.log })


db.exec(dropTableArticle);
db.exec(dropTableUser);
db.exec(createTableArticle);
db.exec(createTableUser);

const insert = db.prepare('INSERT INTO article (title, description, user) VALUES (@title, @desc, @user)');

const insertMany = db.transaction((articles) => {
  for (const article of articles) insert.run(article)
})

insertMany([
  { title: "title1", desc: "desc1", user: 'all' },
  { title: "title2", desc: "desc2", user: 'all' }
]);

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/", repoRouter)

app.use(function (req, res) {
  res.status(404).send("route not FOUND")
})

module.exports = app
