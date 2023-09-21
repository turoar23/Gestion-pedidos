const { ObjectId } = require('mongodb');
const restaurantModel = require('../models/restaurant.model');

module.exports.findRestaurantByIntegrationKey = async (name, key) => {
  if (!name || typeof name !== 'string') throw new Error('Name must be a string');
  if (!key || typeof key !== 'string') throw new Error('Key must be a string');

  return await restaurantModel.findOne({ 'integrations.name': name, 'integrations.key': key });
};

// FIXME: Changing the value of restaurant in the collection of order, this will be useless
module.exports.findRestaurantByName = async name => {
  return await restaurantModel.findOne({ name });
};

module.exports.findRestaurantByUser = async user => {
  let restaurants = [];

  if (user.role === 'Admin')
    restaurants.push(...(await restaurantModel.find({ owner: new ObjectId(user.owner), removed: false })));
  else {
    const restaurantsIds = (user.restaurants || []).map(restaurant => restaurant._id);
    restaurants.push(...(await restaurantModel.find({ _id: { $in: restaurantsIds }, removed: false })));
  }

  return restaurants;
};
