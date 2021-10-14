const Order = require('../models/order');
const Rider = require('../models/rider');
const Group = require('../models/group');

const webSocket = require('../socket');
const utils = require('../utils');

// const mongoose = require('mongoose');
const Moment = require('moment-timezone');
const group = require('../models/group');

exports.getOrders = (req, res, next) => {
	Order.find()
		.then(orders => {
			return Order.populate(orders, {
				path: 'rider',
				select: 'name',
			});
		})
		.then(orders => {
			res.send({ result: orders, err: null });
		})
		.catch(err => {
			console.log(err);
			res.send({ result: null, err: "Can't get orders" });
		});
};

exports.getOrder = (req, res, next) => {
	const _id = req.params.orderId;
	Order.findById(_id)
		.then(orders => {
			return Order.populate(orders, {
				path: 'rider',
				select: 'name',
			});
		})
		.then(order => {
			res.send({ result: order, err: null });
		})
		.catch(err => {
			console.log(err);
			res.send({ result: null, err: "Can't get the order" });
		});
};
exports.postOrdersFilter = (req, res, next) => {
	const filter = req.body;

	Order.find(filter)
		.then(result => {
			res.send({ result: result, err: null });
		})
		.catch(err => {
			res.send({ result: null, err: err });
		});
};
exports.getOrdersByDate = (req, res, next) => {
	const begin = req.body.begin;
	const end = req.body.end;

	// Order.find({ status: "Completed" }).slice('times', -1).where('times.by').gte(begin).lte(end)
	//TODO: hacerlo con el fulfill no me termina de convencer mucho, aun asi se basa en que nunca pondran un pedido para mas tarde tipo dia siguiente a las 00:15
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
		.then(orders => {
			return Order.populate(orders, {
				path: 'rider',
				select: 'name',
			});
		})
		.then(orders => {
			res.send({ result: orders, err: null });
		})
		.catch(err => {
			console.log(err);
			res.send({ result: null, err: "Can't get the orders" });
		});
};
exports.getActiveOrders = (req, res, next) => {
	Order.find({ status: ['Active', 'Delivering', 'Arrived'] })
		// .sort('group')
		.then(orders => {
			return Order.populate(orders, {
				path: 'rider',
				select: 'name',
			});
		})
		.then(orders => {
			res.send({ result: orders, err: null });
		})
		.catch(err => {
			console.log(err);
			res.send({ result: null, err: "Can't get the active orders" });
		});
};

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
			// console.log('Updated Order');
			webSocket.getIO().emit('Orders', {
				action: 'Order updated',
				order: result,
			});
			res.send({ result: 'updated', err: null });
		})
		.catch(err => {
			console.log(err);
			res.send({ result: null, err: "Can't update the order" });
		});
};
exports.updateStatusOrder = (req, res, next) => {
	//TODO: Esto se debe poder simplificar :/
	let id = req.body._id;

	Order.findById(id)
		// Actualizamos el pedido
		.then(order => {
			order.status = req.body.status || order.status;
			order.times.push({
				by: Date.parse(Date()),
				action: req.body.action,
			});
			Group.findById(order.group)
				.then(group => {
					// Si la orden tiene grupo, se actualiza el grupo en base a si tiene pedidos en curso o no
					if (group) {
						return Order.find({
							_id: { $in: group.orders },
							status: { $ne: 'Completed' },
						})
							.then(ordersGroup => {
								let newStatus = 'Delivering';
								if (ordersGroup.length === 0)
									newStatus = 'Completed';
								group.status = newStatus;
								return group.save();
							})
							.catch(err => {
								throw err;
							});
					}
					// Si no tiene grupo, significa que el pedido se ha actualizado manualmente, entonces le creamos un grupo
					else {
						group = new Group();
						group.status = order.status;
						group.orders.push(order);
						order.group = group;
						return group.save();
					}
				})
				.then(result => {
					return result;
				})
				.catch(err => {
					throw err;
				});
			// Si el pedido se acaba de completar, se envia la encuesta
			if (order.status === 'Completed' && order.restaurant === 'Umbrella' && order.rider !== null && !order.surveySent) {
				order.surveySent = true;
				setTimeout(() => {
					utils
						.sendSurvey(order)
						.then(order => {
							console.log(order);
						})
						.catch(err => console.log(err));
				}, 1000); // Se envia a los 60 minutos
			}
			return order.save();
		})
		.then(orderUpdated => {
			webSocket.getIO().emit('Orders', {
				action: 'Order status updated',
				order: orderUpdated,
			});
			res.send({ result: 'Time added', err: null });
		})
		.catch(err => {
			res.send({ result: null, err: "Can't add the time" });
		});
};
exports.postNewOrder = (req, res, next) => {
	const order = new Order({
		gloriaId: req.body.id,
		client: {
			name: req.body.client.name,
			email: req.body.client.email || undefined,
			phone: req.body.client.phone,
		},
		address: {
			street: req.body.direction.street,
			city: req.body.direction.city,
			zipcode: req.body.direction.zipcode,
			latitue: undefined,
			longitude: undefined,
		},
		restaurant: req.body.restaurant,
		times: [
			{
				by: Date.parse(new Date()),
				action: 'accepted_at',
			},
			{
				by:
					Date.parse(req.body.fulfill_at) ||
					Moment(new Date())
						.tz('Europe/Madrid')
						.add(45, 'm')
						.toDate()
						.valueOf(),
				action: 'fulfill_at',
			},
		],
		payment: req.body.payment,
		status: 'Active',
	});
	order
		.save()
		.then(result => {
			// console.log(result);
			webSocket.getIO().emit('Orders', {
				action: 'New Order',
				order: result,
			});
			res.send({ result: 'New order added', error: null });
		})
		.catch(err => {
			console.log(err);
			res.send({
				result: null,
				error: "An error ocurred, can't add the new order",
			});
		});
};
//TODO: Comprobar si se quiere agregar a al mismo rider no hacer nada
// Se comprueba si el pedido tiene un grupo, y si tiene se borra de el.
// Si el rider tiene un grupo valido, se mete el pedido, si no, se crea
exports.addRider = (req, res, next) => {
	const riderId = req.body.riderId;
	const orderId = req.body.orderId;

	Order.findById(orderId)
		.then(order => {
			// Si el pedido tiene un grupo, se borra de este
			return (
				Group.findById(order.group)
					.then(group => {
						if (group) {
							group.orders.pull(order);
							if (group.orders.length === 0)
								return group.remove();
							return group.save();
						}
						return {};
					})
					.then(() => {
						return order;
					})
					// .then(result => { })
					.catch(err => {
						throw err;
					})
			);
		})
		.then(order => {
			// Comprobamos si el rider tiene un grupo valido, si no, se crea uno nuevo
			Rider.findById(riderId)
				.then(rider => {
					Group.findOne({ rider: rider, status: 'Active' })
						.then(group => {
							if (!group) group = new Group();
							group.orders.push(order);
							group.rider = rider;
							return group.save();
						})
						.then(group => {
							order.group = group;
							order.rider = rider;

							return order.save();
						})
						.then(result => {
							webSocket.getIO().emit('Orders', {
								action: 'Rider assigned',
								order: result,
							});
							res.send({ result: 'Rider assigned', err: null });
						})
						.catch(err => {
							throw err;
						});
				})
				.catch(err => {
					console.log(err);
					res.send({ result: null, err: err });
				});
		})
		.catch(err => {
			// console.log(err);
			res.send({ result: null, err: err });
		});
};

exports.removeRider = (req, res, next) => {
	const orderId = req.body.orderId;

	Order.findById(orderId)
		.then(order => {
			const groupId = order.group;

			if (groupId) {
				Group.findById(groupId)
					.then(group => {
						group.orders.pull({ _id: order._id });
						if (group.orders.length == 0) return group.remove();
						return group.save();
					})
					.then(result => {})
					.catch(err => {
						throw err;
					});
			}
			order.rider = undefined;
			order.group = undefined;
			return order.save();
		})
		.then(result => {
			// console.log(result);
			webSocket.getIO().emit('Orders', {
				action: 'Rider dessasigned',
				order: result,
			});
			res.send({ result: 'Rider desassigned', err: null });
		})
		.catch(err => {
			// console.log(err);
			res.send({ result: null, err: err });
		});
};
