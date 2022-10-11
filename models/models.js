const db = require("../db/connection.js");


function selectTopics () {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

function selectArticlesByID (article_id) {
  return db.query(`SELECT * FROM articles WHERE article_id=$1;`, [article_id])
  .then(({ rows }) => {
    const article = rows[0];
    if (!article) {
      return Promise.reject({
        status: 404,
        msg: `No article found for article_id: ${article_id}`,
      });
    }
    return article;
  });
};

function selectUsers () {
  return db.query(`SELECT * FROM users;`).then((result) => {
    return result.rows;
  });
};

module.exports = {selectTopics, selectArticlesByID, selectUsers}



//tylko eksport
