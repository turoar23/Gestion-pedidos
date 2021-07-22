const Order = require('../models/order');
const Rider = require('../models/rider');

exports.getRiders = (req, res, next) => {
    Rider.find()
        .then(riders => {
            res.send({ result: riders, err: null })
        })
        .catch(err => {
            res.send({ result: null, err: err });
        })
}

exports.postNewRider = (req, res, next) => {
    const rider = new Rider({
        name: req.body.name,
        vehicle: req.body.vehicle
    })

    rider.save()
        .then(result => {
            res.send({ result: 'Rider added', err: null });
        })
        .catch(err => {
            console.log(err);
            res.send({ result: null, err: err })
        })
}


exports.getOrders = (req, res, next) => {
    let riderId = req.params.riderId;

    Rider.findById(riderId)
        .then(rider => {
            return Order.find({ rider: rider })
        })
        .then(orders => {
            res.send({ result: orders, err: null });
        })
        .catch(err => {
            console.log(err);
            res.send({ result: null, err: err });
        })
}
exports.getActiveOrders = (req, res, next) => {
    let riderId = req.params.riderId;

    Rider.findById(riderId)
        .then(rider => {
            return Order.find({ rider: rider, status: { $ne: "Completed" } })
        })
        .then(orders => {
            res.send({ result: orders, err: null });
        })
        .catch(err => {
            console.log(err);
            res.send({ result: null, err: err });
        })
}
exports.index = (req, res, next) => {
    const riderId = req.params.riderId;

    Rider.findById(riderId)
        .then(rider => {
            res.render('rider/orders', { rider: rider });
        })
        .catch(err => {
            console.log(err);
            res.send({ err: err });
        })
}
exports.getLogin = (req, res, next) => {
    res.render('rider/login');
}
exports.postLogin = (req, res, next) => {
    const code = req.body.code;

    Rider.findOne({ code: code })
        .then(rider => {
            if(!rider)
                console.log("Error");
            res.redirect(`/rider/${rider._id}`);
        })
        .catch(err => {
            console.log(err);
            res.redirect('/rider');
        })
}