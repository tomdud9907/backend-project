const db = require("../db/connection.js");


function selectTopics () {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows
  })
}

function selectArticleByID (article_id) {
  return db.query(`SELECT articles.*, COUNT(comment_id) ::INT AS 
  comment_count FROM articles 
  LEFT JOIN comments ON comments.article_id = articles.article_id 
  WHERE articles.article_id = $1 
  GROUP BY articles.article_id;`, [article_id])
  .then(({ rows }) => {
    const article = rows[0]
    if (!article) {
      return Promise.reject({
        status: 404,
        msg: `No article found for article_id: ${article_id}`,
      })
    }
    return article
  })
}

function selectUsers () {
  return db.query(`SELECT * FROM users;`).then((result) => {
    return result.rows
  })
}

function updateVote (votes, articleId) {
  const { article_id } = articleId
  const voteNumber = votes.inc_vote
  if (typeof voteNumber !== "number") {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    })
  } 
  return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
  [voteNumber, article_id])
    .then(({ rows }) => {
      const article = rows[0]
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `Invalid ID`,
        })
      }
      return article
    })
}

function selectArticles (order) {
  if (!order) order = 'created_at'
  return db
  .query
  (`SELECT articles.*, 
  COUNT(comment_id) ::INT AS 
  comment_count FROM articles 
  LEFT JOIN comments ON 
  comments.article_id = articles.article_id 
  GROUP BY articles.article_id
  ORDER BY ${order} DESC;`)
  .then(({ rows })=> {
    return rows
  })
}

module.exports = {selectTopics, selectArticleByID, selectUsers, updateVote, selectArticles}




