const { response } = require('../app');
const app = require('../app')
const {selectTopics, selectArticlesByID} = require('../models/models')


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


module.exports = {getTopics, getArticlesByID}

//eksportujemy i dodajemy poszczegolne funkcje do linii 2