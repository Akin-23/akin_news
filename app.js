const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller");
const { getEndpoints } = require("./controllers/endpoints-controller");
const {
  getArticle,
  getArticles,
  patchArticle,
} = require("./controllers/articles-controller");
const {
  getComments,
  postComment,
  deleteComment,
} = require("./controllers/comments-controller");
const { getUsers } = require("./controllers/users-controller");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticle);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getComments);
app.delete("/api/comments/:comment_id", deleteComment);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", patchArticle);
app.get("/api/users", getUsers);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, request, response, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    response.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23503") {
    response.status(404).send({ msg: "Not found" });
  }
  next(err);
});

module.exports = app;
