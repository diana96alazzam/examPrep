'use strict'

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const methodoverride = require('method-override');

const PORT = process.env.PORT || 4000;

const app = express();
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', errorHandler);

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(methodoverride('_method'));
app.use(cors());
app.set('view engine', 'ejs');



app.get('/', (request, response)=> {
    response.render('add-view');

})
app.get('/', getPerson);
app.post('/add', addPerson);
app.put('/update', updatePerson);
app.delete('/delete', deletePerson);
app.use('*', notFoundHandler);


function getPerson(request, response){
    const SQL = 'SELECT * FROM preptable;'
    client.query(SQL).then((reultList)=> {
        response.render('index', {people: reultList.rows});

    })

}
function addPerson(request, response){
    let name = request.body.formName;
    let age = request.body.formAge;
    const safeValues = [name, age];

    const SQLsearch = 'SELECT (name, age) FROM preptable WHERE (name=$1) AND (age=$2);'
    client.query(SQLsearch, safeValues).then((result)=> {
        if (result.rows.length === 0){
            const SQL = 'INSERT INTO preptable (name, age) VALUES ($1,$2);';
            client.query(SQL, safeValues).then((addResult)=>{
                response.redirect('/');
            })
            
        } else {
            response.redirect('/');
        }

    }).catch((err) => {
        errorHandler(err, req, res);
      });


    
}
function updatePerson(request, response){
    
}
function getPerson(request, response){
    
}
function deletePerson(request, response){
    
}



client.connect().then(()=>{
    app.listen(PORT, ()=> console.log(`working on PORT ${PORT}` ));
})



function notFoundHandler(request, response) {
    response.status(404).send('Page not found.')
}


function errorHandler (error, request, response) {
    response.status(500).send(error);
}




