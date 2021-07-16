const express = require('express')
const Router = express.Router();

const riderController = require('../controllers/riderController');

Router.get('/getRiders', riderController.getRiders);

Router.post('/newRider', riderController.postNewRider);

Router.get('/rider', riderController.getLogin);
Router.post('/riderLogin', riderController.postLogin);

Router.get('/rider/:riderId', riderController.index);
Router.get('/getActiveRiderOrders/:riderId', riderController.getActiveOrders);
Router.get('/getRiderOrders/:riderId', riderController.getOrders);

module.exports = Router;