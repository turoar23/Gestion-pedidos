const express = require('express');
const Router = express.Router();

const ordersController = require('../controllers/ordersController');

// Getters
Router.get('/orders', ordersController.getOrders);
Router.get('/ordersActive', ordersController.getActiveOrders);
Router.get('/orders/:orderId', ordersController.getOrder);

Router.get('/orders/:begin/:end', ordersController.getOrdersByDate);

//FIXME: Check if this resource its really necesary
// Router.post('/getOrderFilter', ordersController.postOrdersFilter);

Router.post('/orders', ordersController.postNewOrder);

Router.put('/orders/addAction', ordersController.addAction);

Router.put('/orders/:orderId', ordersController.modifyOrder);

Router.put('/orders/assignRider', ordersController.addRider);

Router.put('/orders/removeRider', ordersController.removeRider);

module.exports = Router;
