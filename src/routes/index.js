const express = require('express')
const Router = express.Router();

// Routes for the use of the API from GloriaFood
const gloriaRoutes = require('./orders');
const webRoutes = require('./web');
const riderRoutes = require('./rider');
const stepRoutes = require('./step');

// Add the routes to express
Router.use(gloriaRoutes);
Router.use(riderRoutes);
Router.use(stepRoutes);

// Router.use(webRoutes);

module.exports = Router;