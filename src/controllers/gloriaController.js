const Order = require('../models/order');

/**
 * Recive a new order from GloriaFood
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.postNewOrderGloriaFood = (req, res, next) => {
    // check if the order have the authorization header
    let correct = req.headers['authorization'] == 'e7u2Z1e4SgNtY0jgci3aH5YJK9x1jZBSk';

    if (correct) {
        let delivery_orders = req.body;
        if (delivery_orders['count'] > 0) {
            for (var i = 0; i < delivery_orders['count']; i++) {
                let order = delivery_orders['orders'][i];
                if (order['restaurant_token'] == 'GmoV9inQJs7lyrqmBD')
                    order['app'] = 'Tepuy Burger'
                else
                    order['app'] = 'Umbrella';

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
                        longitude: order['longitude']
                    },
                    restaurant: order['app'],
                    times: [
                        {
                            by: Date.parse(order['accepted_at']),
                            action: 'accepted_at'
                        },
                        {
                            by: Date.parse(order['fulfill_at']),
                            action: 'fulfill_at'
                        }
                    ]
                });
                ord.save();
            }
        }
        res.sendStatus(200);
    }
    else
        res.sendStatus(404);
}