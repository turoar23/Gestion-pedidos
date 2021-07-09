const express = require('express')
const Router = express.Router();

const gloriafoodController = require('../controllers/gloriaController');
const ordersController = require('../controllers/ordersController');

// Add the route to post news orders from GloriaFood
Router.post('/gloriafood', gloriafoodController.postNewOrderGloriaFood);

Router.post('/newOrder', ordersController.postNewOrder);

Router.get('/getActiveOrders', ordersController.getActiveOrders);

Router.get('/getOrders', ordersController.getOrders);

Router.post('/modifyOrder', ordersController.modifyOrder);

Router.post('/updateStatusOrder', ordersController.updateStatusOrder);

Router.post('/addTimeOrder', ordersController.addTimeOrder);

module.exports = Router;