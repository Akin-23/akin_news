const db = require("../db/connection.js");


exports.checkUserExists = (username) => {
  return db
    .query(
      `SELECT * FROM users
    WHERE 
    username =$1`,
      [username]
    )
      .then(({ rows }) => {
          if (!rows.length) {
        return Promise.reject({ status: 404, msg: "username does not exist" });
      }
    });
};

exports.selectUsers = () => {
  return db
    .query(
      `SELECT * FROM users`)
    .then(({ rows }) => {
      return rows;
    })
}


