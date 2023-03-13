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

Router.put('/zones/:zoneId/add', addRestaurantZone);
Router.put('/zones/:zoneId/remove', removeRestaurantZone);

module.exports = Router;
