const express = require('express')
const Router = express.Router();

const webController = require('../controllers/webController');
const riderController = require('../controllers/riderController');

// Define the main page of the app
Router.get('/', webController.getIndex);

Router.get('/orders', webController.getIndexOrders);

Router.get('/rider', riderController.getLogin);
Router.post('/riderLogin', riderController.postLogin);

Router.get('/rider/:riderId', riderController.index);


module.exports = Router;