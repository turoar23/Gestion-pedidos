const express = require('express');
const Router = express.Router();

const {
  getRestaurants,
  createRestaurant,
  getRestaurant,
} = require('../controllers/restaurants.controller');

Router.get('/restaurants', getRestaurants);
Router.get('/restaurants/:id', getRestaurant);

Router.post('/restaurants', createRestaurant);

module.exports = Router;
