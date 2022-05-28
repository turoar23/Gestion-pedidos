const express = require('express')
const Router = express.Router();

const stepsController = require('../controllers/stepsController');

// Add the route to post news orders from GloriaFood
Router.get('/steps', stepsController.getSteps);

Router.post('/steps', stepsController.newSteps);

module.exports = Router;