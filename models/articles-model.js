const db = require("../db/connection.js");

exports.selectArticle = (article_id) => {
  return db
    .query(`SELECT articles.*,
    COUNT(comments.article_id) AS
    comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
    
      return rows[0];
    });
};

exports.selectArticles = ({ topic, order = "desc", sort_by = "created_at" }) => {

  const sortByOptions = [
    "created_at",
    "title",
    "author",
    "article_id",
    "topic",
    "votes",
    "comment_count"
  ];
  const tableValues = [];

  if (!sortByOptions.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (order !== "asc" && order !== "desc") {
        return Promise.reject({ status: 400, msg: "Bad request" });
 
  }

  let baseSqlString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at,
   articles.votes, articles.article_img_url, 
   COUNT (comments.article_id) AS comment_count 
   FROM articles 
   LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (topic) {
    baseSqlString += `WHERE articles.topic = $1 `;
    tableValues.push(topic);
  }


  if (order === 'asc') {
    baseSqlString += `GROUP BY articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url
   ORDER BY articles.${sort_by} ASC;`;
  } else {
     baseSqlString += `GROUP BY articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url
   ORDER BY articles.${sort_by} DESC;`;
  }


  return db.query(baseSqlString, tableValues).then(({ rows }) => {
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

  if (inc_votes === undefined) { 
    inc_votes = 0;
  };
  
  return db
    .query(
      `UPDATE articles
        SET votes  = votes + $1
        WHERE article_id = $2
        RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      return rows[0];
    });
};


