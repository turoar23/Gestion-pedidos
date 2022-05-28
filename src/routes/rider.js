const express = require('express')
const Router = express.Router();

const ridersController = require('../controllers/ridersController');

Router.get('/riders', ridersController.getRiders);

Router.post('/riders', ridersController.newRider);

Router.get('/riderOrders/:riderId', ridersController.getOrders);

Router.post('/rider/login', ridersController.getRiderByCode);

//TODO: Check if this is really necesary
// Router.get('/getResumenByRider/:riderId/:date/', ridersController.getOrdersByRiderByDates);

//TODO: Could be better to change the method to a Get
Router.post('/rider/status',ridersController.toggleStatusRider);

module.exports = Router;