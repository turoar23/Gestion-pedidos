const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Configurations
dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', 'views');
app.set('public', 'public');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const routes = require('./src/routes');

// Add the routes to express
app.use(routes);

mongoose
    .connect(process.env.DATABASE)
    .then(result => {
        app.listen(PORT);
    })
    .then(() => {
        console.log(`Listen at port: ${PORT}`)
    })
    .catch(err => {
        console.log(err);
    });