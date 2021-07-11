const express = require('express')
const Router = express.Router();

// Routes for the use of the API from GloriaFood
const gloriaRoutes = require('./orders');
const webRoutes = require('./web');
const riderRoutes = require('./rider');

// Add the routes to express
Router.use(gloriaRoutes);
Router.use(webRoutes);
Router.use(riderRoutes);

module.exports = Router;