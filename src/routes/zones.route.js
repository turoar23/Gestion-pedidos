const express = require('express');
const Router = express.Router();

const {
  getZones,
  addRestaurantZone,
  addZone,
  getRestaurantsZone,
  removeRestaurantZone,
} = require('../controllers/zones.controller');

Router.get('/zones', getZones);
Router.get('/zones/:zoneId/restaurants', getRestaurantsZone);

Router.post('/zones', addZone);

Router.put('/zones/add', addRestaurantZone);
Router.put('/zones/remove', removeRestaurantZone);

module.exports = Router;
