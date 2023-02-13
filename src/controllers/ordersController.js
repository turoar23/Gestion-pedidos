const Order = require('../models/order');
const Rider = require('../models/rider');
const Group = require('../models/group');

const webSocket = require('../utils/socket');
const emailUtils = require('../utils/email');

// const mongoose = require('mongoose');
const Moment = require('moment-timezone');
// const group = require('../models/group');

exports.getOrders = (req, res, next) => {
  Order.find()
    .then(orders => {
      return Order.populate(orders, {
        path: 'rider',
        select: 'name',
      });
    })
    .then(orders => {
      res.send({ result: orders, err: null });
    })
    .catch(err => {
      res.status(500);
      res.send({ result: null, err: "Can't get the orders" });
    });
};

// TODO: Find a better way to make this request
exports.getActiveOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      status: ['Active', 'Delivering', 'Arrived'],
    })
      .populate({
        path: 'rider',
        select: 'name',
      })
      .populate({
        path: 'restaurant',
        select: 'name',
      });
    var ordersClients = await Order.aggregate([
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
    var result = orders.map(order => {
      order = order.toJSON();
      let amount = 0;

      let client = ordersClients.find(client => {
        const email = JSON.stringify(order.client.email) === JSON.stringify(client._id.email);
        const phone = JSON.stringify(order.client.phone) === JSON.stringify(client._id.phone);

        return email || phone;
      });
      amount = client.count;
      return {
        ...order,
        totalOrdersClient: amount,
      };
    });
    res.send({ result: result, err: null });
  } catch (err) {
    res.status(500);
    res.send({ result: null, err: "Can't get the active orders" });
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
          name: order.restaurant,
          phone: order.restaurant === 'Umbrella' ? '+34623411696' : '+34670113435', //TODO: Actualizar con info mas detallada de la entidad de cada restaurante
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
exports.getOrdersByDate = (req, res, next) => {
  // Convert it to number because the string dosent work :(
  const begin = parseInt(req.params.begin);
  const end = parseInt(req.params.end);

  // Order.find({ status: "Completed" }).slice('times', -1).where('times.by').gte(begin).lte(end)
  //TODO: hacerlo con el fulfill no me termina de convencer mucho, aun asi se basa en que nunca pondran un pedido para más tarde tipo dia siguiente a las 00:15
  Order.find({
    $expr: {
      $and: [
        {
          $gte: [{ $arrayElemAt: ['$times.by', 1] }, begin],
        },
        {
          $lte: [{ $arrayElemAt: ['$times.by', 1] }, end],
        },
      ],
    },
  })
    .then(orders => {
      return Order.populate(orders, {
        path: 'rider',
        select: 'name',
      });
    })
    .then(orders => {
      res.send({ result: orders, err: null });
    })
    .catch(err => {
      console.log(err);
      res.send({ result: null, err: "Can't get the orders" });
    });
};

//TODO: Make some check before try to update the order
exports.modifyOrder = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findOne({ _id: orderId })
    .then(order => {
      order.status = req.body.status || order.status;
      order.payment = req.body.payment || order.payment;
      order.client = req.body.client || order.client;
      order.address = req.body.address || order.address;
      order.total_price = req.body.total_price || order.total_price;
      order.statusCorrect =
        req.body.statusCorrect === undefined ? order.statusCorrect : req.body.statusCorrect;

      return order.save();
    })
    .then(result => {
      // console.log('Updated Order');
      webSocket.getIO().emit('Orders', {
        action: 'Order updated',
        order: result,
      });
      res.send({ result: 'updated', err: null });
    })
    .catch(err => {
      console.log(err);
      res.send({ result: null, err: "Can't update the order" });
    });
};
exports.addAction = (req, res, next) => {
  //TODO: Esto se debe poder simplificar :/
  let id = req.body._id;

  Order.findById(id)
    // Actualizamos el pedido
    .then(order => {
      order.status = req.body.status || order.status;
      order.times.push({
        by: Date.parse(Date()),
        action: req.body.action,
      });
      Group.findById(order.group)
        .then(group => {
          // Si la orden tiene grupo, se actualiza el grupo en base a si tiene pedidos en curso o no
          if (group) {
            return Order.find({
              _id: { $in: group.orders },
              status: { $ne: 'Completed' },
            })
              .then(ordersGroup => {
                let newStatus = 'Delivering';
                if (ordersGroup.length === 0) newStatus = 'Completed';
                group.status = newStatus;
                return group.save();
              })
              .catch(err => {
                throw err;
              });
          }
          // Si no tiene grupo, significa que el pedido se ha actualizado manualmente, entonces le creamos un grupo
          else {
            group = new Group();
            group.status = order.status;
            group.orders.push(order);
            order.group = group;
            return group.save();
          }
        })
        .then(result => {
          return result;
        })
        .catch(err => {
          throw err;
        });
      // Si el pedido se acaba de completar, se envia la encuesta a los 60 minutos
      if (
        order.status === 'Completed' &&
        order.restaurant === 'Umbrella' &&
        order.rider !== null &&
        !order.surveySent
      ) {
        order.surveySent = true;
        // Se coloca este tiempo para que la envia al instante en dev
        let timeSurvey = 0.01; // segundos
        // Si la app esta en produccion, se envia a la hora (60 minutos)
        if (process.env.NODE_ENV === 'production') {
          timeSurvey = 60;
        }
        setTimeout(() => {
          emailUtils
            .sendSurvey(order)
            .then(order => {
              console.log(order);
            })
            .catch(err => console.log(err));
        }, timeSurvey * timeSurvey * 1000); // Se envia a los 60 minutos
      }
      return order.save();
    })
    .then(orderUpdated => {
      webSocket.getIO().emit('Orders', {
        action: 'Order status updated',
        order: orderUpdated,
      });
      webSocket.getIO().emit(`order-${orderUpdated._id}`, {
        action: 'Order status updated',
        status: orderUpdated.status,
      });
      res.send({ result: 'Time added', err: null });
    })
    .catch(err => {
      res.send({ result: null, err: "Can't add the time" });
    });
};
exports.postNewOrder = (req, res, next) => {
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
    total_price: req.body.total_price
      ? parseFloat(req.body.total_price.replace(',', '.'))
      : undefined,
    restaurant: req.body.restaurant,
    times: [
      {
        by: Date.parse(new Date()),
        action: 'accepted_at',
      },
      {
        by:
          Date.parse(req.body.fulfill_at) ||
          Moment(new Date()).tz('Europe/Madrid').add(45, 'm').toDate().valueOf(),
        action: 'fulfill_at',
      },
    ],
    payment: req.body.payment,
    status: 'Active',
  });
  order
    .save()
    .then(result => {
      webSocket.getIO().emit('Orders', {
        action: 'New Order',
        order: result,
      });
      res.send({ result: 'New order added', error: null });
    })
    .catch(err => {
      console.log(err);
      res.send({
        result: null,
        error: "An error ocurred, can't add the new order",
      });
    });
};
//TODO: Comprobar si se quiere agregar a al mismo rider no hacer nada
// Se comprueba si el pedido tiene un grupo, y si tiene se borra de el.
// Si el rider tiene un grupo valido, se mete el pedido, si no, se crea
exports.addRider = (req, res, next) => {
  const riderId = req.body.riderId;
  const orderId = req.body.orderId;

  Order.findById(orderId)
    .then(order => {
      // Si el pedido tiene un grupo, se borra de este
      return (
        Group.findById(order.group)
          .then(group => {
            if (group) {
              group.orders.pull(order);
              if (group.orders.length === 0) return group.remove();
              return group.save();
            }
            return {};
          })
          .then(() => {
            return order;
          })
          // .then(result => { })
          .catch(err => {
            throw err;
          })
      );
    })
    .then(order => {
      // Comprobamos si el rider tiene un grupo valido, si no, se crea uno nuevo
      Rider.findById(riderId)
        .then(rider => {
          Group.findOne({ rider: rider, status: 'Active' })
            .then(group => {
              if (!group) group = new Group();
              group.orders.push(order);
              group.rider = rider;
              return group.save();
            })
            .then(group => {
              order.group = group;
              order.rider = rider;

              return order.save();
            })
            .then(result => {
              webSocket.getIO().emit('Orders', {
                action: 'Rider assigned',
                order: result,
              });
              res.send({ result: 'Rider assigned', err: null });
            })
            .catch(err => {
              throw err;
            });
        })
        .catch(err => {
          console.log(err);
          res.send({ result: null, err: err });
        });
    })
    .catch(err => {
      // console.log(err);
      res.send({ result: null, err: err });
    });
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
      webSocket.getIO().emit('Orders', {
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
