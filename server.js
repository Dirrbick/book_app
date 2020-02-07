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

app.get('/test', bookHandler);

// BOOK HANDLER FUNCTION . 
function bookHandler(req, res) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=spiderman';
  superagent.get(url)
    .then(data => {
      console.log(data.text.volumeInfo);


    });
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
  this.title = item.title;
  this.authors = item.authors;
}
app.get('*', (request, response) => response.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Server up on port ${PORT}`));
