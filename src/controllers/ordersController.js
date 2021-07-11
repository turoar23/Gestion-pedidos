const Order = require('../models/order');
const Rider = require('../models/rider');

exports.getOrders = (req, res, next) => {
    Order.find()
        .then(orders => {
            return Order
                .populate(orders, {
                    path: "rider",
                    select: 'name'
                })
        })
        .then(orders => {
            res.send({ result: orders, err: null });
        })
        .catch(err => {
            console.log(err);
            res.send({ result: null, err: "Can't get orders" });
        })
}

exports.getOrder = (req, res, next) => {
    const _id = req.params.orderId;
    Order.findById(_id)
        .then(orders => {
            return Order
                .populate(orders, {
                    path: "rider",
                    select: 'name'
                })
        })
        .then(order => {
            res.send({ result: order, err: null });
        })
        .catch(err => {
            console.log(err);
            res.send({ result: null, err: "Can't get the order" });
        })
}
exports.getActiveOrders = (req, res, next) => {
    Order.find({ $or: [{ status: 'Active' }, { status: 'Delivering' }] })
        .then(orders => {
            return Order
                .populate(orders, {
                    path: "rider",
                    select: 'name'
                })
        })
        .then(orders => {
            res.send({ result: orders, err: null });
        })
        .catch(err => {
            console.log(err);
            res.send({ result: null, err: "Can't get the active orders" });
        })
}


exports.modifyOrder = (req, res, next) => {
    let id = req.body._id;

    Order.findOne({ _id: id })
        .then(order => {
            order.status = req.body.status || order.status;
            order.payment = req.body.payment || order.payment;
            order.client = req.body.client || order.client;
            order.address = req.body.address || order.address;
            return order.save();
        })
        .then(result => {
            console.log('Updated Order');
            res.send({ result: 'updated', err: null });
        })
        .catch(err => {
            console.log(err);
            res.send({ result: null, err: "Can't update the order" });
        })

}
exports.updateStatusOrder = (req, res, next) => {
    let id = req.body._id;

    Order.findOne({ _id: id })
        .then(order => {
            order.status = req.body.status || order.status;
            order.times.push(
                {
                    by: Date.parse(Date()),
                    action: req.body.action
                });
            return order.save();
        })
        .then(result => {
            console.log('Time added');
            res.send({ result: 'Time added', err: null });
        })
        .catch(err => {
            console.log(err);
            res.send({ result: null, err: "Can't add the time" });
        });
}
exports.addTimeOrder = (req, res, next) => {
    let gloriaId = req.body.gloriaId;

    Order.findOne({ gloriaId: gloriaId })
        .then(order => {
            order.times.push(
                {
                    by: Date.parse(Date()),
                    action: req.body.action
                });
            return order.save();
        })
        .then(result => {
            console.log('Time added');
            res.send({ result: 'Time added', err: null });
        })
        .catch(err => {
            console.log(err);
            res.send({ result: null, err: "Can't add the time" });
        });
}

// {
//     "name": "Paola Torregrosa",
//     "email": "turoar2006@gmail.com",
//     "phone": "+34622429914",
//     "restaurant": "Umbrella",
//     "fulfill_at": "14:15:00 2021-02-04",
//     "payment": "CASH",
//     "direction": {
//         "street": "Doctor fleming 10 3B",
//         "city": "San vicente del raspeig",
//         "zipcode": "03690",
//         "more_address": "Calle"
//     }
// }
exports.postNewOrder = (req, res, next) => {
    const order = new Order({
        gloriaId: req.body.id,
        client: {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        },
        address: {
            street: req.body.direction.street,
            city: req.body.direction.city,
            zipcode: req.body.direction.zipcode,
            latitue: null,
            longitude: null
        },
        restaurant: req.body.restaurant,
        times: [{
            by: Date.parse(new Date()),
            action: "accepted_at"
        },
        {
            by: Date.parse(req.body.fulfill_at),
            action: "fulfill_at"
        }],
        payment: req.body.payment,
        status: "Active"
    });
    order.save()
        .then(result => {
            // console.log(result);
            res.send({ result: "New order added", error: null });
        })
        .catch(err => {
            console.log(err);
            res.send({ result: null, error: "An error ocurred, can't add the new order" });
        })
}

exports.addRider = (req, res, next) => {
    const riderId = req.body.riderId;
    const orderId = req.body.orderId;

    Order.findById(orderId)
        .then(order => {
            Rider.findById(riderId)
                .then(rider => {
                    // order.rider = {
                    //     name: rider.name,
                    //     riderId: rider
                    // }
                    order.riderId = rider;
                    return order.save();
                })
                .then(result => {
                    console.log(result);
                    res.send({ result: 'Rider assigned', err: null })
                })
                .catch(err => {
                    console.log(err);
                    res.send({ result: null, err: err })
                })
        })
        .catch(err => {
            console.log(err);
            res.send({ result: null, err: err })
        })
}