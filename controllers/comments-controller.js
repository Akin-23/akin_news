const { createComment } = require('../models/comments-model');

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