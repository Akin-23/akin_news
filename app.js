const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller");
const { getEndpoints } = require("./controllers/endpoints-controller");


app.get("/api/topics", getTopics);

app.get("/api", getEndpoints)



module.exports = app;

