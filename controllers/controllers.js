const { response } = require('../app');
const app = require('../app')
const {selectTopics, selectArticlesByID, selectUsers, updateVote} = require('../models/models')


function getTopics(request, response) {    
    selectTopics().then((topics) => {        
        response.status(200).send({ topics })
    })
}

function getArticlesByID (request, response, next) {
    const { article_id } = request.params
    selectArticlesByID(article_id)
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

function patchUpdateVote (req, res, next) {
    updateVote(req.body, req.params)
      .then((updatedArticle) => {
        res.status(201).send({ updatedArticle })
     })
      .catch((err) => {
        next(err)
      })
  }

module.exports = {getTopics, getArticlesByID, getUsers, patchUpdateVote}
