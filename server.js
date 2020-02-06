'use strict';
require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT;
const app = express();

//set up view engine and serve static CSS files
app.use(express.urlencoded({ extended: true}));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.get('/', homeRender);
// app.get('/search', searchRender);





//page renders

function homeRender(req, res) {
  res.render('pages/index.ejs');
}

function Book(item){
  this.title = item.title;
  this.
}
app.get('*', (request, response) => response.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Server up on port ${PORT}`));
