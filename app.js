const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller");
const { getEndpoints } = require("./controllers/endpoints-controller");
const { getArticle } = require('./controllers/articles-controller');


app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticle);

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Invalid id" });
    } next(err);
});

app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(err.status).send({ msg: err.msg })
    }
})




module.exports = app;

