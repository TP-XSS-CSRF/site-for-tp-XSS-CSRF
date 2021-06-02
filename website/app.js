var createError = require("http-errors")
var express = require("express")
var path = require("path")
var logger = require("morgan")
const Database = require("better-sqlite3")
var cors = require("cors")

var indexRouter = require("./routes/index")
var repoRouter = require("./routes/repository")

var app = express()

app.use(cors())

const dropTable = "DROP TABLE IF EXISTS article;"
const createTable =
  "CREATE TABLE article ('title' varchar, 'description' varchar);"

const db = new Database("articles.db", { verbose: console.log })

db.exec(dropTable)
db.exec(createTable)

const insert = db.prepare(
  "INSERT INTO article (title, description) VALUES (@title, @desc)"
)
const insertMany = db.transaction((articles) => {
  for (const article of articles) insert.run(article)
})

insertMany([
  { title: "title1", desc: "desc1" },
  { title: "title2", desc: "desc2" },
])

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
