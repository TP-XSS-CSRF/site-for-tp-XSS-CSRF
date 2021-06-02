var express = require("express")
var router = express.Router()
const path = require("path")
const db = require("better-sqlite3")("articles.db")

const dropTable = "DROP TABLE IF EXISTS article;"
const createTable =
  "CREATE TABLE article ('title' varchar, 'description' varchar);"
const insert = db.prepare(
  "INSERT INTO article (title, description) VALUES (@title, @desc)"
)
const insertMany = db.transaction((articles) => {
  for (const article of articles) insert.run(article)
})

/* GET home page. */

router.post("/article/add", function (req, res, next) {
  console.log(req.body)
  if (req.body.title === undefined || req.body.desc === undefined)
    res.send("Sry but you need to give 2 param exactly")

  const rdyToRun = db.prepare(
    "INSERT INTO article (title,description) VALUES (?,?)"
  )
  const article = [req.body.title, req.body.desc]

  rdyToRun.run(article)

  res.redirect("back")
})

router.get("/articles/all", function (req, res, next) {
  res.json(db.prepare("SELECT title, description FROM article").all())
})

router.get("/articles/delete", function (req, res) {
  db.exec(dropTable)
  db.exec(createTable)
  insertMany([
    { title: "title1", desc: "desc1" },
    { title: "title2", desc: "desc2" },
  ])
  res.send("Success !!")
})

module.exports = router
