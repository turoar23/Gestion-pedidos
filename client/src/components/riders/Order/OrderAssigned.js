import { useContext, useState, Fragment, useEffect } from 'react';
import moment from 'moment-timezone';

import Card from '../../UI/Card';
import useHttp from '../../hooks/use-http';
import RiderContext from '../../../store/rider-context';
import { updateOrderStatus } from '../../lib/api';
import OrderOptions from './OrderOptions';
import { getUrlGoogleMaps } from '../../lib/utils';

import classes from './OrderAssigned.module.css';

const OrderAssigned = props => {
	const ctx = useContext(RiderContext);
	const { sendRequest, status } = useHttp(updateOrderStatus);
	const [order, updateOrder] = useState(props.order);
	const [show, setShow] = useState(false);
	const [actualTime, setActualTime] = useState(moment());

	useEffect(() => {
		setInterval(() => {
			setActualTime(moment());
		}, 60 * 1000);
	}, []);

	let newStatus = '';
	let action = '';
	const fulfill = moment(
		order.times.find(time => {
			return time.action === 'fulfill_at';
		}).by
	);
	let timeLeft = Math.round(
		moment.duration(actualTime.diff(fulfill)).asMinutes()
	);
	let timeLeftClasses = classes.normal;
	if (timeLeft >= 0) timeLeftClasses = classes.warning;
	if (timeLeft > 10) timeLeftClasses = classes.danger;

	let statusClasses = classes.active;
	if (order.status === 'Delivering' || order.status === 'Arrived')
		statusClasses = classes.delivering;

	const handleShow = () => setShow(true);
	const handleClose = () => setShow(false);

	const updateStatusHandler = async () => {
		let completed = false;

		if (order.status === 'Active') {
			newStatus = 'Delivering';
			action = 'Start delivering';
		} else if (order.status === 'Delivering') {
			newStatus = 'Arrived';
			action = 'Arrived destination';
		} else {
			newStatus = 'Completed';
			action = 'Completed';
			completed = true;
		}

		await sendRequest({
			_id: order._id,
			status: newStatus,
			action: action,
		});
		updateOrder({
			...order,
			status: newStatus,
		});

		if (completed) ctx.updateOrders();
	};
	const phoneHandler = () => {
		window.open(`tel:${order.client.phone}`);
	};
	const openGoogleHandler = () => {
		window.open(
			getUrlGoogleMaps(
				order.address.street,
				order.address.zipcode,
				order.restaurant
			)
		);
	};
	let forLater = '';
	if (typeof order.for_later !== 'undefined')
		forLater = order.for_later ? <sup className='for-later'>P</sup> : '';

	return (
		<Fragment>
			<Card className={classes.card} key={order._id}>
				<div className={`${classes.statusBar} ${statusClasses}`}></div>
				<div className={classes.title}>
					<div className={classes.status}>{order.status}</div>
					<div className={classes.fulfill}>
						{fulfill.tz('Europe/Madrid').format('LT')}
						{forLater}
					</div>
				</div>
				<div className={classes.options}>
					<div onClick={phoneHandler}>
						<i className={'fas fa-phone-alt'}></i>
					</div>
					<div onClick={openGoogleHandler}>
						<i className={'fas fa-map-marked-alt'}></i>
					</div>
					<div onClick={handleShow}>
						<i className={'fas fa-plus'}></i>
					</div>
				</div>
				<div className={classes.body}>
					<div className={`${classes.timeLeft} ${timeLeftClasses}`}>
						{timeLeft}
					</div>
					{/* <div>{order.client.name}</div> */}
					{/* <div>{order.client.phone}</div> */}
					<div>{order.address.street}</div>
					{order.address.floor && <div>{order.address.floor}</div>}
					<div>{`${order.address.zipcode} ${order.address.city}`}</div>
					{/* <Card.Text>{order.payment}</Card.Text> */}
				</div>
				<div className={classes.nextStep} onClick={updateStatusHandler}>
					Siguiente
				</div>
			</Card>
			<OrderOptions show={show} onClose={handleClose} order={order} />
		</Fragment>
	);
};

export default OrderAssigned;
