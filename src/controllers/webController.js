const Rider = require('../models/rider');

exports.getIndex = (req, res, next) => {
    res.render('index');
};

exports.getIndexOrders = (req, res, next) => {
    res.render('orders/orders_panel');
}

exports.getIndexRider = (req, res, next) => {
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
// exports.getAdmin = (req, res, next) => {
//     res.render('admin/index.ejs');
// }