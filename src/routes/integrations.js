const express = require('express')
const Router = express.Router();

const integrationsController = require('../controllers/integrationsController');

// Add the route to post news orders from GloriaFood
Router.post('/integrations/gloriafood', integrationsController.postNewOrderGloriaFood);

module.exports = Router;