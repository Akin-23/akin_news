const { selectComments,createComment,removeComment,checkCommentExists } = require('../models/comments-model');
const { checkArticleExists } = require("../models/articles-model");




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

exports.postComment = (req, res, next) => {
  const commentToPost = req.body;
  const { article_id } = req.params;
  createComment(commentToPost, article_id)
    .then((comment) => {
      res.status(201).send({ comment: comment });
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


