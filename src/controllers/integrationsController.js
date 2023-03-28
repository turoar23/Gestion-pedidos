const Order = require('../models/order');
const {
  createTask,
  getInfoTask,
  filterTimes,
  getStatus,
} = require('../services/integrations/tookan');
const { findRestaurantByIntegrationKey } = require('../services/restaurant.service');
const webSocket = require('../utils/socket');

/**
 * Receive a new order from GloriaFood
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.postNewOrderGloriaFood = async (req, res, next) => {
  // check if the order have the authorization header
  const correct = req.headers['authorization'] == 'e7u2Z1e4SgNtY0jgci3aH5YJK9x1jZBSk';

  if (correct) {
    let delivery_orders = req.body;
    if (delivery_orders['count'] > 0) {
      for (var i = 0; i < delivery_orders['count']; i++) {
        try {
          let order = delivery_orders['orders'][i];
          if (!(await Order.findOne({ gloriaId: order['id'] }))) {
            // if (order['restaurant_token'] == 'GmoV9inQJs7lyrqmBD') order['app'] = 'Tepuy Burger';
            // else order['app'] = 'Umbrella';
            // FIXME: Change this to the _id of the restaurant
            // order['app'] = restaurant.name;

            // Check the status of the order
            let status = 'Active';
            if (order['status'] !== 'accepted') status = order['status'];

            // Create a new Order based in the schema in the model
            const ord = new Order({
              gloriaId: order['id'],
              client: {
                name: `${order['client_first_name']} ${order['client_last_name']}`,
                email: order['client_email'],
                phone: order['client_phone'],
              },
              address: {
                ...order['client_address_parts'],
                latitude: order['latitude'],
                longitude: order['longitude'],
              },
              restaurant: order['app'],
              total_price: order['total_price'],
              for_later: order['for_later'],
              times: [
                {
                  by: Date.parse(order['accepted_at']),
                  action: 'accepted_at',
                },
                {
                  by: Date.parse(order['fulfill_at']),
                  action: 'fulfill_at',
                },
              ],
              payment: order['payment'],
              status: status,
              items: order['items'],
            });
            const restaurant = await findRestaurantByIntegrationKey(
              'GloriaFood',
              order['restaurant_token']
            );
            ord.restaurant = restaurant;
            const orderInserted = await ord.save();

            if (restaurant.settings?.automaticPartner === true) {
              await createTask(orderInserted, restaurant);
            }

            webSocket.getIO().emit('Orders', {
              action: 'New Order from GloriaFod',
              order: ord,
            });
          }
        } catch (err) {
          console.error(err);
          res.sendStatus(404);
        }
      }
    }
    res.sendStatus(200);
  } else res.sendStatus(404);
};

exports.getTookanTaskInfo = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    const taskDetails = await getInfoTask(orderId);

    res.status(200).send(taskDetails);
  } catch (error) {
    next(error);
  }
};

exports.postTookanWebhook = async (req, res, next) => {
  try {
    const bodyParsed = JSON.parse(JSON.stringify(req.body));

    // if (bodyParsed.tookan_shared_secret === process.env.SHARED_SECRET_TOOKAN) {
    const order = await Order.findOne({ gloriaId: bodyParsed.job_id });

    if (!order) throw new Error('Cant find this order');

    const times = filterTimes(bodyParsed);

    times.forEach(time => {
      const exists = order.times.find(orderTime => orderTime.action === time.action);

      if (exists === undefined) order.times.push(time);
    });

    order.partner = {
      id: bodyParsed.job_id,
      name: 'Tookan',
      original: bodyParsed,
    };

    order.status = getStatus(bodyParsed);

    await order.save();

    res.status(200).send();
    // } else {
    //   throw new Error('Error in the verification');
    // }
  } catch (error) {
    next(error);
  }
};
