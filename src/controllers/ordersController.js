const Order = require('../models/order');
const Rider = require('../models/rider');
const Group = require('../models/group');

const webSocket = require('../utils/socket');
const emailUtils = require('../utils/email');

// const mongoose = require('mongoose');
const Moment = require('moment-timezone');
const restaurantModel = require('../models/restaurant.model');
const { createTask, updateOrderTookan } = require('../services/integrations/tookan');
const BaseError = require('../errors/baseError');
const { getActiveOrders, getOrders, getOrdersBetweenDates, orderAddAction } = require('../services/orders.service');
// const group = require('../models/group');

/**
 * Receive a new order from GloriaFood
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.getOrders = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) throw new BaseError('User not logged', 404);

    const onlyActive = req.query.active === 'true';
    let result = [];

    if (onlyActive) result = await getActiveOrders(userId);
    else result = await getOrders(userId);

    res.send({ result: result, err: null });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = (req, res, next) => {
  const _id = req.params.orderId;
  Order.findById(_id)
    .then(orders => {
      return Order.populate(orders, {
        path: 'rider',
        select: 'name',
      });
    })
    .then(order => {
      res.send({ result: order, err: null });
    })
    .catch(err => {
      res.send({ result: null, err: "Can't get the order with that id" });
    });
};

exports.getOrderTracking = (req, res, next) => {
  const _id = req.params.orderId;
  Order.findById(_id)
    .populate('restaurant', 'name')
    .then(orders => {
      return Order.populate(orders, {
        path: 'rider',
        select: 'name',
      });
    })
    .then(order => {
      const date = new Date(order.times[order.times.length - 1]?.by);
      const dateLimit = date.setTime(date.getTime() + 1 * 60 * 60 * 1000); // After an hour

      if (new Date() > dateLimit && date.status === 'Completed') throw new Error();

      const orderParsed = {
        _id: order._id,
        id: order.gloriaId || null,
        status: order.status,
        restaurant: {
          name: order.restaurant.name,
          phone: order.restaurant.name === 'Umbrella' ? '+34623411696' : '+34670113435', //TODO: Actualizar con info mas detallada de la entidad de cada restaurante
          colors: {
            main: '#ee2737',
          },
        },
        rider: order.rider?.name || null,
        items: order.items || [],
      };
      res.send({ result: orderParsed, err: null });
    })
    .catch(err => {
      res.status(404).send({ result: null, err: "Can't get the order with that id" });
    });
};

exports.postOrdersFilter = (req, res, next) => {
  const filter = req.body;

  Order.find(filter)
    .then(result => {
      res.send({ result: result, err: null });
    })
    .catch(err => {
      res.send({ result: null, err: err });
    });
};

/**
 * Receive a new order from GloriaFood
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.getOrdersByDate = async (req, res, next) => {
  const userId = req.user?._id;
  if (!userId) throw new BaseError('User not logged', 404);

  // Convert it to number because the string doesn't work :(
  const begin = parseInt(req.params.begin);
  const end = parseInt(req.params.end);

  try {
    const orders = await getOrdersBetweenDates(userId, begin, end);

    res.send({ result: orders, err: null });
  } catch (err) {
    next(err);
  }
};

//TODO: Make some check before try to update the order
/**
 * Receive a new order from GloriaFood
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.modifyOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const order = await Order.findOne({ _id: orderId });

    order.status = req.body.status || order.status;
    order.payment = req.body.payment || order.payment;
    order.client = req.body.client || order.client;
    order.address = req.body.address || order.address;
    order.total_price = req.body.total_price || order.total_price;
    order.statusCorrect = req.body.statusCorrect === undefined ? order.statusCorrect : req.body.statusCorrect;

    const orderSaved = await order.save();

    res.send({ result: 'updated', err: null });

    webSocket.getIO().to(orderSaved.restaurant).emit('Orders', {
      action: 'Order updated',
      order: orderSaved,
    });
  } catch (err) {
    console.error(err);

    res.send({ result: null, err: "Can't update the order" });
  }
};

/**
 * Receive a new order from GloriaFood
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.addAction = async (req, res, next) => {
  try {
    const orderId = req.body._id;
    const newStatus = req.body.status;
    const action = req.body.action;

    if (!newStatus && !action) throw new BaseError('Need status or action to update the order', 400);

    await orderAddAction(orderId, newStatus, action);

    res.send({ result: null, err: "Can't add the time" });
  } catch (err) {
    next(err);
  }
};

/**
 * Receive a new order from GloriaFood
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.postNewOrder = async (req, res) => {
  try {
    const restaurant = await restaurantModel.findById(req.body.restaurant);

    if (!restaurant) {
      // FIXME
      res.status(401).send();
    } else {
      const order = new Order({
        gloriaId: req.body.id,
        client: {
          name: req.body.client.name,
          email: req.body.client.email || undefined,
          phone: req.body.client.phone,
        },
        address: {
          street: req.body.direction.street,
          city: req.body.direction.city,
          zipcode: req.body.direction.zipcode,
          floor: req.body.direction.floor || undefined,
          latitue: undefined,
          longitude: undefined,
        },
        total_price: req.body.total_price ? parseFloat(req.body.total_price.replace(',', '.')) : undefined,
        restaurant: restaurant._id,
        times: [
          {
            by: Date.parse(new Date()),
            action: 'accepted_at',
          },
          {
            by:
              Date.parse(req.body.fulfill_at) ||
              Moment(new Date())
                .tz('Europe/Madrid')
                .add(req.body.time || 45, 'm')
                .toDate()
                .valueOf(),
            action: 'fulfill_at',
          },
        ],
        payment: req.body.payment,
        status: 'Active',
        owner: restaurant.owner,
      });

      const orderSaved = await order.save();

      res.send({ result: 'New order added', error: null });

      webSocket.getIO().to(orderSaved.restaurant.toString()).emit('Orders', {
        action: 'New Order',
        order: orderSaved,
      });
    }
  } catch (err) {
    console.error(err);

    res.send({
      result: null,
      error: "An error ocurred, can't add the new order",
    });
  }
};
//TODO: Comprobar si se quiere agregar a al mismo rider no hacer nada
// Se comprueba si el pedido tiene un grupo, y si tiene se borra de el.
// Si el rider tiene un grupo valido, se mete el pedido, si no, se crea
exports.addRider = async (req, res, next) => {
  try {
    const riderId = req.body.riderId;
    const orderId = req.body.orderId;

    const order = await Order.findById(orderId);
    if (!order) throw new BaseError('Can`t find the oder', 404);
    // Si el pedido tiene un grupo, se borra de este
    // const group = await Group.findById(order.group);
    // if (group) {
    //   group.orders.pull(order);
    //   if (group.orders.length === 0) return group.remove();
    //   await group.save();
    // }
    // Comprobamos si el rider tiene un grupo valido, si no, se crea uno nuevo
    const rider = await Rider.findById(riderId);
    if (!rider) throw new BaseError('Can`t find the rider', 404);

    // const groupActive = await Group.findOne({ rider: rider, status: 'Active' });
    // if (!groupActive) groupActive = new Group();
    // groupActive.orders.push(order);
    // groupActive.rider = rider;
    // const groupUpdated = await groupActive.save();
    // order.group = groupUpdated;
    order.rider = rider;

    const orderSaved = await order.save();
    res.send({ result: 'Rider assigned', err: null });

    webSocket.getIO().to(order.restaurant.toString()).emit('Orders', {
      action: 'Rider assigned',
      order: orderSaved,
    });
  } catch (err) {
    // console.log(err);
    res.send({ result: null, err: err });
  }
};

exports.removeRider = (req, res, next) => {
  const orderId = req.body.orderId;

  Order.findById(orderId)
    .then(order => {
      const groupId = order.group;

      if (groupId) {
        Group.findById(groupId)
          .then(group => {
            group.orders.pull({ _id: order._id });
            if (group.orders.length == 0) return group.remove();
            return group.save();
          })
          .then(result => {})
          .catch(err => {
            throw err;
          });
      }
      order.rider = undefined;
      order.group = undefined;
      return order.save();
    })
    .then(result => {
      // console.log(result);
      webSocket.getIO().to(result.restaurant.toString()).emit('Orders', {
        action: 'Rider dessasigned',
        order: result,
      });
      res.send({ result: 'Rider desassigned', err: null });
    })
    .catch(err => {
      // console.log(err);
      res.send({ result: null, err: err });
    });
};

exports.sendPartner = async (req, res, next) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId).populate('restaurant');

  try {
    const response = await createTask(order, order.restaurant);

    res.send(response);
  } catch (error) {
    next(error);
  }
};

exports.updateOrderTookan = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    await updateOrderTookan(orderId);

    res.status(200).send();
  } catch (error) {
    next(error);
  }
};
