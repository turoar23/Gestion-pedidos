const restaurantModel = require('../models/restaurant.model');
const zoneModel = require('../models/zone.model');

module.exports.createZone = async name => {
  const zone = await zoneModel.create({ name });
  await zone.save();
};

module.exports.addRestaurant = async (zoneId, restaurantId) => {
  const zone = await zoneModel.findById(zoneId);
  if (!zone) throw new Error('Cant find the zone');

  const restaurant = await restaurantModel.findById(restaurantId);
  if (!restaurant) throw new Error('Cant find the restaurant');

  // Check if it already exists;
  if (zone.restaurants.findIndex(restaurant => restaurant.toString() === restaurantId) !== -1)
    return;

  zone.restaurants.push(restaurant);
  await zone.save();
  restaurant.zone = zone;
  await restaurant.save();
};

module.exports.removeRestaurant = async (zoneId, restaurantId) => {
  const zone = await zoneModel.findById(zoneId);
  if (!zone) throw new Error('Cant find the zone');

  const restaurant = await restaurantModel.findById(restaurantId);
  if (!restaurant) throw new Error('Cant find the restaurant');

  // Check if it already exists;
  if (zone.restaurants.findIndex(restaurant => restaurant.toString() === restaurantId) === -1)
    return;

  zone.restaurants.pull(restaurant);
  await zone.save();
  restaurant.zone = undefined;
  await restaurant.save();
};
