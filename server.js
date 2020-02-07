'use strict';
require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT;
const app = express();

//set up view engine and serve static CSS files
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.get('/', homeRender);
app.get('/searches/new', formRender);
// app.get('/search', searchRender);





//page renders
function homeRender(req, res) {
  res.render('pages/index.ejs');
}
//Form renders .
function formRender(req, res) {
  res.render('pages/searches/new.ejs');
}

function Book(item) {
  this.title = item.title;
  this.description = item.description;
}
app.get('*', (request, response) => response.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Server up on port ${PORT}`));
