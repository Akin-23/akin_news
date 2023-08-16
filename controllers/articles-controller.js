const {
  selectArticle,
  selectArticles,
  selectComments,
  checkArticleExists,
  updateArticle,
} = require("../models/articles-model");
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
  const promises = [selectComments(article_id), checkArticleExists(article_id)];
  Promise.all(promises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const votes = req.body;

 const promises = [updateArticle(votes , article_id), checkArticleExists(article_id)];
  Promise.all(promises)
    .then((resolvedPromises) => {
      const article = resolvedPromises [0]
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });

}
