'use strict';
require('dotenv').config();
const superagent = require('superagent');
const express = require('express');
const PORT = process.env.PORT;
const app = express();

//set up view engine and serve static CSS files
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.get('/hello', homeRender);
app.get('/searches/new', formRender);

// app.get('/search', searchRender);


app.post('/searches', bookHandler);


// BOOK HANDLER FUNCTION . 
function bookHandler(req, res) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  if (req.body.search[1] === 'title') { url += `+intitle:${req.body.search[0]};` }
  if (req.body.search[1] === 'author') { url += `+inauthor:${req.body.search[0]};` }
  superagent.get(url)
    .then(data => JSON.parse(data.text).items.map(obj => new Book(obj)))
    .then(results => res.render('pages/searches/show', { searchResults: results }))

    .catch(() => errorHandler('Error 500! Something has gone wrong with the website server!', req, res));

}



// ERROR HANDLER FUNCIOTN . 
function errorHandler(error, req, response) {
  response.status(500).send(error);
}



//page renders
function homeRender(req, res) {
  res.render('pages/index.ejs');
}
//Form renders .
function formRender(req, res) {
  res.render('pages/searches/new.ejs');
}

// Constracter function of book . 
function Book(item) {
  this.title = item.volumeInfo.title || 'no title available';
  this.authors = item.volumeInfo.authors || 'no title available';
}



app.get('*', (req, response) => response.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Server up on port ${PORT}`));
