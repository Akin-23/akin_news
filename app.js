const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller");
const { getEndpoints } = require("./controllers/endpoints-controller");
const { getArticle, getArticles } = require("./controllers/articles-controller");
const {getComments,postComment,} = require("./controllers/comments-controller");


app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticle);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", postComment);



app.all('/*', (req, res) => {
    res.status(404).send({msg: 'Not found'})
})

app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(err.status).send({ msg: err.msg });
  } next (err)
});

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Invalid id" });
    } next(err);
});

app.use((err, request, response, next) => {
  if (err.code === "23503") {
    response.status(400).send({ msg: "Bad request" });
  }
  next(err);
});

app.use((err, request, response, next) => {
  if (err.code === "23502") {
    response.status(400).send({ msg: "Comment missing username/body" });
  }
  next(err);
});






module.exports = app;

