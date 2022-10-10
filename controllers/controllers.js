const app = require('../app')
const {selectTopics} = require('../models/models')


function getTopics(request, response) {    
    selectTopics().then((topics) => {        
        response.status(200).send({ topics });
    })
}


module.exports = {getTopics}

//eksportujemy i dodajemy poszczegolne funkcje do linii 2