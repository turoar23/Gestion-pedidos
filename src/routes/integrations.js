const express = require('express');
const Router = express.Router();

const integrationsController = require('../controllers/integrationsController');

Router.get('/integrations/tookan/task/:id', integrationsController.getTookanTaskInfo);

// Add the route to post news orders from GloriaFood
Router.post('/integrations/gloriafood', integrationsController.postNewOrderGloriaFood);
Router.post('/integrations/tookan/webhook', integrationsController.postTookanWebhook);

module.exports = Router;
