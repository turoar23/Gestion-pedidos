const express = require('express');
const Router = express.Router();

const webController = require('../controllers/webController');
// const riderController = require('../controllers/riderController');

// Define the main page of the app
Router.get('/', webController.getIndex);

Router.get('/orders', webController.getIndexOrders);

Router.get('/rider/:riderId', webController.getIndexRider);
Router.get('/rider', webController.getLogin);
Router.post('/riderLogin', webController.postLogin);

// Router.get('/admin', webController.getAdmin);

module.exports = Router;
