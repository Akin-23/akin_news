const {
  selectArticle,
  selectArticles,
  selectComments,
  checkArticleExists,
  updateArticle,
  checkCommentExists,
  removeComment,
} = require("../models/articles-model");
const { formatCommentCount } = require("../db/seeds/utils");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then((article) => {
      article.comment_count = parseInt(article.comment_count);
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  parameters = req.query;
  selectArticles(parameters)
    .then((articles) => {
      const formattedArticles = formatCommentCount(articles);

      res.status(200).send({ articles: formattedArticles });
    })
    .catch((err) => {
      next(err);
    });
};



exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const votes = req.body;

 updateArticle(votes , article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
   .catch((err) => {
      next(err);
    });
};

