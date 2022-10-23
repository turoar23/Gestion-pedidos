const express = require('express');
const Router = express.Router();

const {
  getRestaurants,
  createRestaurant,
  getRestaurant,
  updateRestaurant,
  removeRestaurant,
} = require('../controllers/restaurants.controller');

Router.get('/restaurants', getRestaurants);
Router.get('/restaurants/:id', getRestaurant);

Router.post('/restaurants', createRestaurant);

Router.put('/restaurants/:id', updateRestaurant);

Router.delete('/restaurants/:id', removeRestaurant);

module.exports = Router;
