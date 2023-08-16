const db = require("../db/connection.js");

exports.selectArticle = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return rows[0];
    });
};

exports.selectArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at,
   articles.votes, articles.article_img_url, COUNT (comments.article_id) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id 
   ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

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

exports.checkArticleExists = (article_id) => {
  return db
    .query(
      `SELECT * FROM articles
    WHERE 
    article_id =$1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
    });
};

exports.updateArticle = ({ inc_votes }, article_id) => {
  return db
    .query(
      `UPDATE articles
        SET votes  = votes + $1
        WHERE article_id = $2
        RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
