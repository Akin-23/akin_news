const db = require('../db/connection')

exports.selectComments = (article_id) => {
  return db
    .query(
      `SELECT comments.* FROM comments
       WHERE 
       comments.article_id = $1
       ORDER BY
       comments.created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};


exports.createComment = ({ username, body }, article_id) => {
    return db
      .query(
        `INSERT INTO comments 
            (author, body, article_id) 
            VALUES ($1, $2, $3) 
            RETURNING *`,
        [username, body, article_id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
}

  exports.checkCommentExists = (comment_id) => {
    return db
      .query(
        `SELECT * FROM comments
    WHERE 
    comment_id =$1`,
        [comment_id]
      )
      .then(({ rows }) => {
        if (!rows.length) {
          return Promise.reject({ status: 404, msg: "comment does not exist" });
        }
      });
  };

  exports.removeComment = (comment_id) => {
    return db
      .query(
        `DELETE FROM comments 
    WHERE comment_id =$1`,
        [comment_id]
      )
      .then(({ rows }) => {
        return rows;
      });
  };

  exports.selectComment_count = (article_id) => {
    return db
      .query(
        `SELECT COUNT(*) AS comment_count
  FROM comments
  WHERE article_id = $1;`,
        [article_id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  };
  

