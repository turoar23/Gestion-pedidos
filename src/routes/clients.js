const express = require('express')
const Router = express.Router();

const ordersController = require('../controllers/clientController')

// Add the route to post news orders from GloriaFood
Router.get('/clients', ordersController.getClients);

module.exports = Router;