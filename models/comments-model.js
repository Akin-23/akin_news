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
