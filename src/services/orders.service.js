const BaseError = require('../errors/baseError');
const Order = require('../models/order');
const UserModel = require('../models/user');
const mongoose = require('mongoose');

/**
 * Return the orders that a user can see
 * @param {string} userId
 */
exports.getOrders = async userId => {
  const user = await UserModel.findById(userId);
  if (!user) throw new BaseError('Cant find this user', 404);

  let query = {};
  if (user.role === 'Admin') {
    query.owner = mongoose.Types.ObjectId(user.owner);
  } else {
    query.restaurant = { $in: (user.restaurants || []).map(restaurant => mongoose.Types.ObjectId(restaurant._id)) };
  }

  const orders = await Order.find({ query }).populate({
    path: 'rider',
    select: 'name',
  });

  return orders;
};

/**
 * Return the orders that a user can see
 * @param {string} userId
 */
exports.getActiveOrders = async userId => {
  const user = await UserModel.findById(userId);
  if (!user) throw new BaseError('Cant find this user', 404);

  let query = {};
  if (user.role === 'Admin') {
    query.owner = mongoose.Types.ObjectId(user.owner);
  } else {
    query.restaurant = { $in: (user.restaurants || []).map(restaurant => mongoose.Types.ObjectId(restaurant._id)) };
  }

  const orders = await Order.find({
    ...query,
    status: ['Active', 'Delivering', 'Arrived'],
  })
    .populate({
      path: 'rider',
      select: 'name',
    })
    .populate({
      path: 'restaurant',
      select: ['name', 'internalName'],
    });

  const ordersClients = await Order.aggregate([
    {
      $match: {
        client: {
          $in: orders.map(order => order.client),
        },
      },
    },
    {
      $group: {
        _id: '$client',
        count: { $sum: 1 },
      },
    },
  ]);

  const result = orders.map(order => {
    order = order.toJSON();
    let permission = 'read';

    if (user.role === 'Admin') {
      permission = 'all';
    } else {
      const restaurantUser = user.restaurants.find(
        restaurant => restaurant._id.toString() === order.restaurant._id.toString()
      );
      if (restaurantUser) permission = restaurantUser.permissions;
    }

    const client = ordersClients.find(client => {
      const email = JSON.stringify(order.client.email) === JSON.stringify(client._id.email);
      const phone = JSON.stringify(order.client.phone) === JSON.stringify(client._id.phone);

      return email || phone;
    });
    const amount = client.count;

    return {
      ...order,
      permission,
      totalOrdersClient: amount,
    };
  });

  return result;
};
