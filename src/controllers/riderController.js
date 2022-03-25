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
//TODO: update to a login name and behaviour
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
		code: req.body.code,
		status: true,
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
};

exports.toggleStatusRider = (req, res) => {
	const riderId = req.body.riderId;

	Rider.findById(riderId)
		.then(rider => {
			// TODO: agregar que no se pueda cambiar el estado de un rider con pedidos asignados
			// const query = Order.find({
			// 	rider: rider,
			// 	status: ['Active', 'Delivering', 'Arrived'],
			// }).then(result => {
			// 	return result;
			// });
			// console.log(query);
			// if (query.length > 0)
			// 	throw new Error('The rider have orders actives assignaded');
			if (rider.status === null) rider.status = true;
			else rider.status = !rider.status;

			return rider.save();
		})
		.then(rider => {
			res.send({ result: 'Rider status updated', err: null });
		})
		.catch(err => {
			console.log(err);
			res.send({
				result: null,
				err: 'An error ocurred updating the status of the rider',
			});
		});
};
