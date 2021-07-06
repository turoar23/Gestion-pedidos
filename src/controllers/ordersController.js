const Order = require('../models/order');

exports.getActiveOrders = (req, res, next) => {
    Order.find({ status: 'Active' })
        .then(orders => {
            if (orders.length > 0)
                res.send({ result: orders, err: null });
            else
                res.send({ result: [], err: null });
        })
        .catch(err => {
            console.log(err);
            res.send({ result: null, err: "Can't get the active orders" });
        })
}

exports.modifyOrder = (req, res, next) => {
    let gloriaId = req.body.gloriaId;

    Order.findOne({ gloriaId: gloriaId })
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

// exports.postEditProduct = (req, res, next) => {
//     const prodId = req.body.productId;
//     const updatedTitle = req.body.title;
//     const updatedPrice = req.body.price;
//     const updatedImageUrl = req.body.imageUrl;
//     const updatedDesc = req.body.description;

//     Product.findById(prodId).then((product) => {
//         product.title = updatedTitle;
//         product.price = updatedPrice;
//         product.imageUrl = updatedImageUrl;
//         product.description = updatedDesc;
//         return product.save()
//     })
//         .then((result) => {
//             console.log("UPDATED PRODUCT!");
//             res.redirect("/admin/products");
//         })
//         .catch((err) => console.log(err));
// };