const { selectComments,createComment } = require('../models/comments-model');
const { checkArticleExists } = require("../models/articles-model");
const { checkUserExists } = require("../models/users-model");




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
  const { username } = commentToPost;
  const { article_id } = req.params;
  const promises = [
    createComment(commentToPost, article_id),
    //checkUserExists(username),
    checkArticleExists(article_id),
  ];
    Promise.all(promises)
      .then((resolvedPromises) => {
        const comment = resolvedPromises[0];
      res.status(201).send({ comment: comment });
      })
      .catch((err) => {
        next(err);
      });
};

