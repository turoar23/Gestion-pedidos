const express = require('express');
const Router = express.Router();

const ordersController = require('../controllers/ordersController');

// Getters
Router.get('/orders', ordersController.getOrders);
// FIXME: Think how change this name
Router.get('/ordersActive', ordersController.getActiveOrders);
Router.get('/orders/:orderId', ordersController.getOrder);
Router.get('/orders/dates/:begin/:end', ordersController.getOrdersByDate);

//FIXME: Think how improve this. Currently this is used to check the orders that are available from the view of a rider
Router.post('/getOrderFilter', ordersController.postOrdersFilter);
Router.post('/orders', ordersController.postNewOrder);

Router.put('/orders/action', ordersController.addAction);
Router.put('/orders/assignRider', ordersController.addRider);
Router.put('/orders/removeRider', ordersController.removeRider);
Router.put('/orders/:orderId', ordersController.modifyOrder);

module.exports = Router;
