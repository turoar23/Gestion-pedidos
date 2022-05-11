const Order = require('../models/order');

exports.getClients = async (req, res, next) => {
    try {
        const clients = await Order.aggregate([
            {
                $group: {
                    _id: '$client',
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'client',
                    as: 'orders',
                },
            },
        ]);

        res.send({ result: clients, err: null });
    }catch(err){
        res.send({ result: null, err: "Can't get the clients" });
    }
}