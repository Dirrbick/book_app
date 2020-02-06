'use strict';
require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT;
const app = express();

//set up view engine and serve static CSS files
app.use(express.static('./public'));

//app.use(express.urlencoded({ extended: true}));








app.listen(PORT, () => console.log(`Server up on port ${PORT}`));
