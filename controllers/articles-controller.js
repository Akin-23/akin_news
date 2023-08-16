const { selectArticle, selectArticles, selectComments } = require("../models/articles-model");
const { formatCommentCount } = require("../db/seeds/utils");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  selectArticles()
      .then((articles) => {
          const formattedArticles = formatCommentCount(articles);
      
      res.status(200).send(formattedArticles);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  selectComments(article_id)
    .then((comments) => {
    res.status(200).send(comments)
    })
    .catch((err) => {
      next(err);
  })
}
