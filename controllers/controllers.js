const { response } = require('../app');
const app = require('../app')
const fs = require("fs");
const {selectTopics, 
  selectArticleByID, 
  selectUsers, 
  updateVote,
  selectArticles,
  selectCommentsByArticleId,
  insertComment,
  removeCommentById} = require('../models/models')

 function getApi (req, res, next) {
   fs.readFile("endpoints.json", "utf8", function (err, data) {
    console.log(data)
    let allEndpoints = JSON.parse(data)
    res.status(200).send(allEndpoints)
    })
}


function getTopics(request, response) {    
    selectTopics().then((topics) => {        
        response.status(200).send({ topics })
    })
}

function getArticleByID (request, response, next) {
    const { article_id } = request.params
    selectArticleByID(article_id)
    .then((article) => {
        response.status(200).send({article: article})
    })
    .catch((err) => {
        next(err)
      })
}

function getUsers(request, response, next) {    
    selectUsers().then((users) => {        
        response.status(200).send({ users })
    })
    .catch((err) => {
        next(err)
      })
}

function patchUpdateVote (request, response, next) {
  const article_id = request.params
  const newVote = request.body
    updateVote(newVote, article_id)
      .then((updatedArticle) => {
        response.status(201).send({ updatedArticle })
     })
      .catch((err) => {
        next(err)
      })
}

function getArticles (request, response, next) {
    const { sort_by, order, topic} = request.query
    selectArticles(sort_by, order, topic).then((articles) => {        
      response.status(200).send({ articles })     
  })
  .catch((err) => {
    next(err);
  })
}

function getCommentsByArticleId (request, response, next) {
  const { article_id } = request.params
  selectCommentsByArticleId(article_id)
  .then((comments) => {
    response.status(200).send({ comments })
  })
  .catch((err) => {
    next(err)
  })
}

function postComment (request, response, next) {
  const { article_id } = request.params;
  const { username, body} = request.body;
  insertComment(body, username, article_id)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err)
    })
}

function deleteCommentById (request, response, next) {
  const{ comment_id } = request.params
  removeCommentById(comment_id)
  .then(() => {
    response.status(204).send('No content')
  })
  .catch((err) => {
    next(err)
  })
}



module.exports = {getTopics, getArticleByID, getUsers, patchUpdateVote, getArticles, getCommentsByArticleId, postComment, deleteCommentById, getApi}

