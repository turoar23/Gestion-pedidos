const express = require('express')
const Router = express.Router();

const ordersController = require('../controllers/ordersController');

Router.post('/newOrder', ordersController.postNewOrder);

Router.get('/getActiveOrders', ordersController.getActiveOrders);

Router.get('/getOrders', ordersController.getOrders);

Router.get('/getOrder/:orderId', ordersController.getOrder);

Router.post('/getOrderFilter', ordersController.postOrdersFilter);

Router.post('/getOrderByDates', ordersController.getOrdersByDate);

Router.post('/modifyOrder', ordersController.modifyOrder);

Router.post('/updateStatusOrder', ordersController.updateStatusOrder);

// Router.post('/addTimeOrder', ordersController.addTimeOrder);

Router.post('/assignRiderOrder', ordersController.addRider);

Router.post('/removeRiderOrder', ordersController.removeRider);

module.exports = Router;