const express = require('express')
const Router = express.Router();

const webController = require('../controllers/webController');

// Define the main page of the app
Router.get('/', webController.getIndex);

Router.get('/pwa/', webController.getIndexPwa);


module.exports = Router;