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



app.get('/', getPeople )
app.get('/add', getForm);
app.get('/people/:person_id', getPerson)
app.post('/add', addPerson);
app.put('/update/:person_id', updatePerson);
app.delete('/delete/:person_id', deletePerson);
app.use('*', notFoundHandler);


function getPeople(request, response){
    const SQL = 'SELECT * FROM preptable;'
    client.query(SQL).then((resultList)=> {
        response.render('index', {people: resultList.rows});
    }).catch((err) => {
        errorHandler(err, request, response);
      });
}

function getForm (request, response){
    response.render('add-view');
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
        errorHandler(err, request, response);
      });    
}


function getPerson(request, response){
    
    const SQL = 'SELECT * FROM preptable WHERE id=$1;'
    const values = [request.params.person_id];
    client.query(SQL, values).then((results)=> {
        response.render('detail', { person: results.rows[0] })
    })  
    
}


function updatePerson(request, response){

    const SQL = 'UPDATE preptable SET name=$1, age=$2 WHERE id=$3; '
    const values = [request.body.formName, request.body.formAge, request.params.person_id];
    client.query(SQL, values).then((result)=> {
        response.redirect(`/people/${request.params.person_id}`);
    }).catch((err) => errorHandler(err, request, response));
}


function deletePerson(request, response){
    const SQL = 'DELETE FROM preptable WHERE id=$1;'
    const values = [request.params.person_id];
    client.query(SQL, values).then((result)=> {
        response.redirect('/');
    })
    
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




