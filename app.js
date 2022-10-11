const express = require("express");
const { getTopics, getArticlesByID } = require('./controllers/controllers')
const app = express();
app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticlesByID)


app.use((err, req, res, next) => {
    if (err.code === "22P02" ) { //22p02- invalid input syntax
      res.status(400).send({ msg: "Invalid input" });
    } else if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      console.log(err);
      res.status(500).send("Server Error!");
    }
  });


module.exports = app