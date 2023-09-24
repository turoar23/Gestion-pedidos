const mongoose = require('mongoose');

const BaseError = require('../errors/baseError');
const Order = require('../models/order');
const UserModel = require('../models/user');
const webSocket = require('../utils/socket');
const emailUtils = require('../utils/email');
const RestaurantModel = require('../models/restaurant.model');

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

/**
 * Get the orders by user between the given dates
 * @param {String} userId
 * @param {Number} startDate
 * @param {Number} endDate
 * @returns {Promise<any[]>}
 */
exports.getOrdersBetweenDates = async (userId, startDate, endDate) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new BaseError('Cant find this user', 404);

  let query = {
    'times.1.by': { $gte: startDate, $lte: endDate },
  };

  if (user.role === 'Admin') {
    query.owner = mongoose.Types.ObjectId(user.owner);
  } else {
    query.restaurant = { $in: (user.restaurants || []).map(restaurant => mongoose.Types.ObjectId(restaurant._id)) };
  }

  //TODO: hacerlo con el fulfill no me termina de convencer mucho, aun asi se basa en que nunca pondran un pedido para más tarde tipo dia siguiente a las 00:15
  const orders = await Order.find(query)
    .populate({
      path: 'rider',
      select: 'name',
    })
    .populate({
      path: 'restaurant',
      select: ['internalName', 'name'],
    });

  return orders;
};

/**
 * Update the status or add an action to the order
 * @param {String} orderId
 * @param {String} [status]
 * @param {String} [action]
 * @returns
 */
exports.orderAddAction = async (orderId, status, action) => {
  const order = await Order.findById(orderId);
  if (!order) throw new BaseError('Cant find this user', 404);

  order.status = status || order.status;

  if (action) {
    order.times.push({
      by: Date.parse(Date()),
      action,
    });
  }

  const orderSaved = await order.save();

  sendEmailSurvey(orderSaved)
    .then()
    .catch(err => {
      console.error(err);
    });

  notifyWebsocket(orderSaved)
    .then()
    .catch(err => {
      console.error(err);
    });

  return orderSaved;
};

// -----------------
// Private functions
// -----------------

const sendEmailSurvey = async order => {
  try {
    const restaurantId = order.restaurant;
    const restaurant = await RestaurantModel.findById(restaurantId);

    // Only works for USH llinares
    if (!restaurant) throw new Error(`Cant find the restaurant ${restaurantId}`);
    if (restaurant.name !== 'Umbrella') return;

    if (order.status === 'Completed' && order.rider !== null && !order.surveySent) {
      console.log('Sending ...');
      order.surveySent = true;
      // Se coloca este tiempo para que la envia al instante en dev
      let timeSurvey = 0.01; // segundos
      // Si la app esta en produccion, se envia a la hora (60 minutos)
      if (process.env.NODE_ENV === 'production') {
        timeSurvey = 60;
      }
      setTimeout(async () => {
        await emailUtils.sendSurvey(order, restaurant);
      }, timeSurvey * timeSurvey * 1000); // Se envia a los 60 minutos
    } else {
      console.log('We dont send the email');
    }
  } catch (err) {
    console.error(err);
  }
};

const notifyWebsocket = async order => {
  // FIXME: make tracker goes by order id
  // webSocket.getIO().emit(`order-${orderUpdated._id}`, {
  //   action: 'Order status updated',
  //   status: orderUpdated.status,
  // });

  webSocket.getIO().to(order.restaurant.toString()).emit('Orders', {
    action: 'Order status updated',
    order,
  });
};
