'use strict';
require('dotenv').config();
const superagent = require('superagent');
const express = require('express');
const PORT = process.env.PORT;
const app = express();
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);

//set up view engine and serve static CSS files
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', homeRender);
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
  let SQL = 'SELECT * FROM books';
  client.query(SQL)
    .then(() => {
      console.log('Db')
      const books = booksTest;
      let { author, title, image_url, description } = books;
      let booksDb = `INSERT INTO books (author, title, image, description) VALUES ('${author}' , '${title}' , '${image_url}' , '${description}')`;
      client.query(booksDb);
      console.log(books)
      res.status(200).send(books);


    })
    .catch(() => errorHandler('Error 500! Something has gone wrong with the website server!', req, res));


}
//test sql 
var booksTest = {
  title: 'Harry Potter',
  author: 'JK Rowling',
  image: `<img src="http://books.google.com/books/content?id=f280CwAAQBAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api"`,
  description: 'this is the description'
};

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

