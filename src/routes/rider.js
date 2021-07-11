const express = require('express')
const Router = express.Router();

const riderController = require('../controllers/riderController');

Router.get('/getRiders', riderController.getRiders);

Router.post('/newRider', riderController.postNewRider);

Router.get('/rider', riderController.index);

Router.get('/getActiveRiderOrders/:riderId', riderController.getActiveOrders);
Router.get('/getRiderOrders/:riderId', riderController.getOrders);

module.exports = Router;