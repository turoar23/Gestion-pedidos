const restaurantModel = require('../models/restaurant.model');

module.exports.findRestaurantByIntegrationKey = async (name, key) => {
  if (!name || typeof name !== 'string') throw new Error('Name must be a string');
  if (!key || typeof key !== 'string') throw new Error('Key must be a string');

  return await restaurantModel.findOne(
    { 'integrations.name': name, 'integrations.key': key }
  );
};

// FIXME: Changing the value of restaurant in the collection of order, this will be useless
module.exports.findRestaurantByName = async name => {
  return await restaurantModel.findOne({ name });
};
