const express = require('express')
const Router = express.Router();

const stepsController = require('../controllers/stepController');

// Add the route to post news orders from GloriaFood
Router.get('/getSteps', stepsController.getSteps);

Router.post('/newSteps', stepsController.postNewSteps);

module.exports = Router;