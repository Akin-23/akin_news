const db = require('../db/connection')
const {convertTimestampToDate} = require('../db/seeds/utils')

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
