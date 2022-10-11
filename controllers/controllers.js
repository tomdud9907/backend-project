const { response } = require('../app');
const app = require('../app')
const {selectTopics, selectArticlesByID, selectUsers} = require('../models/models')


function getTopics(request, response) {    
    selectTopics().then((topics) => {        
        response.status(200).send({ topics });
    })
}

function getArticlesByID (request, response, next) {
    const { article_id } = request.params
    selectArticlesByID(article_id)
    .then((article) => {
        response.status(200).send({article: article})
    })
    .catch((err) => {
        next(err);
      });
}

function getUsers(request, response) {    
    selectUsers().then((users) => {        
        response.status(200).send({ users });
    })
}


module.exports = {getTopics, getArticlesByID, getUsers}

//eksportujemy i dodajemy poszczegolne funkcje do linii 2