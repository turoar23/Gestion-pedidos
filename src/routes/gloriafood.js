const express = require('express')
const Router = express.Router();

const gloriafoodController = require('../controllers/gloriaController');

Router.post('/integration/gloriafood', gloriafoodController.postNewOrderGloriaFood);

module.exports = Router;