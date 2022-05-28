const express = require('express')
const Router = express.Router();

// Routes for the use of the API from GloriaFood
const ordersRoutes = require('./orders');
const integrationsRoutes = require('./integrations');
const riderRoutes = require('./rider');
const stepRoutes = require('./step');
const reviewsRoutes = require('./reviews');
const clientRoutes = require('./clients');

// Add the routes to express
Router.use(ordersRoutes);
Router.use(integrationsRoutes);
Router.use(riderRoutes);
Router.use(stepRoutes);
Router.use(reviewsRoutes);
Router.use(clientRoutes);

// Router.use(webRoutes);

module.exports = Router;