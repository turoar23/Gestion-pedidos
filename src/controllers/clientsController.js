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
	} catch (err) {
		res.status(500);
		res.send({ result: null, err: "Can't get the clients" });
	}
};

exports.getClient = async (req, res, next) => {
	const clientEmail = req.params.clientEmail;

	try {
		const client = await Order.aggregate([
			{
				$group: {
					_id: '$client',
					count: { $sum: 1 },
				},
			},
			{
				$match: {
					"client.email": clientEmail,
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

		res.send({ result: client, err: null });
	} catch (err) {
		res.status(500);
		res.send({ result: null, err: "Can't get the clients" });
	}
};
