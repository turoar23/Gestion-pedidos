const express = require('express');
const Router = express.Router();

const auth = require('../middlewares/auth');

const {
  getRestaurants,
  createRestaurant,
  getRestaurant,
  updateRestaurant,
  removeRestaurant,
} = require('../controllers/restaurants.controller');

Router.get('/restaurants', auth.authenticate, auth.authorize(['Admin']), getRestaurants);
Router.get('/restaurants/:id', auth.authenticate, auth.authorize(['Admin']), getRestaurant);

Router.post('/restaurants', auth.authenticate, auth.authorize(['Admin']), createRestaurant);

Router.put('/restaurants/:id', auth.authenticate, auth.authorize(['Admin']), updateRestaurant);

Router.delete('/restaurants/:id', auth.authenticate, auth.authorize(['Admin']), removeRestaurant);

module.exports = Router;
