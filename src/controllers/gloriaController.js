const Order = require('../models/order');

/**
 * Recive a new order from GloriaFood
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.postNewOrderGloriaFood = (req, res, next) => {
    let correct = req.headers['authorization'] == 'e7u2Z1e4SgNtY0jgci3aH5YJK9x1jZBSk';

    if (correct) {
        delivery_orders = req.body;
        if (delivery_orders['count'] > 0) {
            for (var i = 0; i < delivery_orders['count']; i++) {
                if (utils.checkIfNewOrder(delivery_orders['orders'][i]))
                    console.log("Repetido");
                //let pedido = gloria.parseDelivery(delivery_orders['orders'][i]);
                else {
                    //TODO: Quitar campos que no se usan
                    console.log("Pedido");
                    let order = delivery_orders['orders'][i];
                    let id = order.id;
                    if (order['restaurant_token'] == 'GmoV9inQJs7lyrqmBD')
                        order['app'] = 'Tepuy Burger'
                    else
                        order['app'] = 'Umbrella';
                    order['status'] = 'pedido';
                    order['group'] = 0;
                    order['repartido'] = 0;
                    order['accepted_at'] = moment(order['accepted_at']).tz('Europe/Madrid').format('HH:mm:ss YYYY-MM-DD');
                    order['fulfill_at'] = moment(order['fulfill_at']).tz('Europe/Madrid').format('HH:mm:ss YYYY-MM-DD');
                    order['address'] = utils.parseStreet(order.client_address_parts.street) + ", " + order.client_address_parts.zipcode + ", " + order.client_address_parts.city;

                    orders.push(order);

                    /*if (order.latitude == 0 || order.longitude == 0) {
                        getCoordinates(id)
                            .then(result => {
                                let ubication = JSON.parse(result).results[0];
                                if (ubication.geometry != null) {
                                    let index = orders.findIndex(element => element.id == id);
                                    orders[index].latitude = ubication.geometry.location.lat;
                                    orders[index].longitude = ubication.geometry.location.lng;
                                }
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    }*/
                }
            }
        }
        //fs.writeFileSync('./database/orders.json', JSON.stringify(orders));
        res.sendStatus(200);
    }
    else
        res.sendStatus(404);
}