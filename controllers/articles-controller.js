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
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;
  selectArticles(topic)
    .then((articles) => {
      const formattedArticles = formatCommentCount(articles);

      res.status(200).send({ articles: formattedArticles });
    })
    .catch((err) => {
      console.log(err);
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

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  const promises = [removeComment(comment_id), checkCommentExists(comment_id)];
  Promise.all(promises)
    .then(() => {

      res.status(204).send("");
    })
    .catch((err) => {
      next(err);
    });
}

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  const promises = [removeComment(comment_id), checkCommentExists(comment_id)];
  Promise.all(promises)
    .then(() => {

      res.status(204).send("");
    })
    .catch((err) => {
      next(err);
    });
}