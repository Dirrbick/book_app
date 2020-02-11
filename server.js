'use strict';
require('dotenv').config();
const superagent = require('superagent');
const express = require('express');
const PORT = process.env.PORT;
const app = express();
const pg = require('pg');
// const methodOverride = require('_method_Override');
const client = new pg.Client(process.env.DATABASE_URL);
//set up view engine and serve static CSS files
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride(_method));

app.set('view engine', 'ejs');

app.get('/', homeRender);
app.get('/searches/new', formRender);

app.post('/books', databaseHandler);

// app.get('/search', searchRender);
app.post('/searches', bookHandler);


// THIS IS HOME PAGE OF DATABASE SHOW. 

function homeRender(req, res) {
  // i want to get all the information from the database. 
  // render it on the index page. 
  let SQL2 = 'SELECT * FROM books;';
  client.query(SQL2)
    .then(results => {
      console.log('results form database show', results.rows);
      res.render('pages/index', { databaseResults: results.rows })
    })
    .catch(() => errorHandler('error 500! something has gone wrong on the database homeRender', req, res));
}




//ADDING TO DATABASE . 

function databaseHandler(req, res) {
  let author = req.body.book_authors;
  let image_url = req.body.book_image;
  let title = req.body.book_title;
  let description = req.body.book_description;

  let SQL1 = 'INSERT INTO books (author , image_url , title , description) VALUES ( $1 , $2 , $3 , $4);';
  let safeValue = [author, image_url, title, description];
  client.query(SQL1, safeValue)
    .then(results => {
      console.log('this is inside client query');
    })
    .catch(() => errorHandler('Error 500 ! something has gone wrong with the database handler!', req, res));


}


// BOOK HANDLER FUNCTION . 
function bookHandler(req, res) {
  let url = `https://www.googleapis.com/books/v1/volumes?q=`;
  if (req.body.search[1] === 'title') { url += `+intitle:${req.body.search[0]};` }
  else { url += `+inauthor:${req.body.search[0]};` }
  superagent.get(url)
    .then(data => {
      let results = data.body.items.map(obj => new Book(obj));
      res.render('pages/searches/show', { searchResults: results })
    })



    .catch(() => errorHandler('Error 500 ! Something has gone wrong with the  bookHandler !', req, res));

}



// ERROR HANDLER FUNCIOTN . 
function errorHandler(error, req, response) {
  response.status(500).send(error);
}



//Form renders .
function formRender(req, res) {
  res.render('pages/searches/new.ejs');
}

// Constracter function of book . 
function Book(item) {
  this.title = item.volumeInfo.title || 'no title available';
  this.authors = item.volumeInfo.authors || ['no title available'];
  this.image = `<img src="${item.volumeInfo.imageLinks.smallThumbnail}">` || 'no picture available';
  this.description = item.volumeInfo.description || 'no description available';
}



app.get('*', (req, response) => response.status(404).send('This route does not exist'));

client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`Server up on port ${PORT}`));
  });

