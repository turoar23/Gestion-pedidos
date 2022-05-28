const express = require('express')
const Router = express.Router();

const clientsController = require('../controllers/clientsController')

Router.get('/clients', clientsController.getClients);
Router.get('/client/:clientEmail', clientsController.getClient);

module.exports = Router;