const Order = require('../models/order');
const Rider = require('../models/rider');

var ObjectId = require('mongoose').Types.ObjectId;

const Moment = require('moment-timezone');

exports.getRiders = (req, res, next) => {
	Rider.find()
		.then(riders => {
			res.send({ result: riders, err: null });
		})
		.catch(err => {
			res.send({ result: null, err: err });
		});
};

exports.getRiderByCode = (req, res, next) => {
	const code = req.body.code;

	Rider.findOne({ code: code })
		.then(rider => {
			if (!rider) throw new Error('No se encontro el rider');
			res.send({ result: rider, err: null });
		})
		.catch(err => {
			res.send({ result: null, err: err });
		});
};

exports.postNewRider = (req, res, next) => {
	const rider = new Rider({
		name: req.body.name,
		vehicle: req.body.vehicle,
	});

	rider
		.save()
		.then(result => {
			res.send({ result: 'Rider added', err: null });
		})
		.catch(err => {
			console.log(err);
			res.send({ result: null, err: err });
		});
};

exports.getOrders = (req, res, next) => {
	let riderId = req.params.riderId;

	Rider.findById(riderId)
		.then(rider => {
			return Order.find({ rider: rider });
		})
		.then(orders => {
			res.send({ result: orders, err: null });
		})
		.catch(err => {
			console.log(err);
			res.send({ result: null, err: err });
		});
};
exports.getActiveOrders = (req, res, next) => {
	let riderId = req.params.riderId;

	Rider.findById(riderId)
		.then(rider => {
			return Order.find({
				rider: rider,
				status: ['Active', 'Delivering', 'Arrived'],
			});
		})
		.then(orders => {
			res.send({ result: orders, err: null });
		})
		.catch(err => {
			console.log(err);
			res.send({ result: null, err: err });
		});
};

exports.getOrdersByRiderByDates = (req, res, next) => {
	const riderId = req.params.riderId;
	const date = req.params.date;

	const begin = Moment(new Date(date)).tz('Europe/Madrid').valueOf();
	const end = Moment(new Date(date))
		.tz('Europe/Madrid')
		.add(1, 'month')
		.valueOf();

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
		.where('rider', new ObjectId(riderId))
		.then(orders => {
			console.log(orders.length);
			res.send({ result: orders, err: null });
		})
		.catch(err => {
			console.log(err);
			res.send({ result: null, err: "Can't get the orders" });
		});

	// res.send(200);

	// Moment(new Date('2020-07-01')).tz('Europe/Madrid').format('Y-M-D')

	// Order.find
};
