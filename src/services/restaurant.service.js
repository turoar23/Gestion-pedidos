const restaurantModel = require('../models/restaurant.model');

module.exports.findRestaurantByIntegrationKey = async (name, key) => {
  if (!name || typeof name !== 'string') throw new Error('Name must be a string');
  if (!key || typeof key !== 'string') throw new Error('Key must be a string');

  return await restaurantModel.findOne(
    { 'integrations.name': name, 'integrations.key': key },
    { name: 1 }
  );
};
