import { useContext, useState, Fragment } from 'react';
import { Card, Button } from 'react-bootstrap';
import moment from 'moment-timezone';

import useHttp from '../hooks/use-http';
import RiderContext from '../../store/rider-context';
import { updateOrderStatus } from '../lib/api';
import OrderOptions from './OrderOptions';
import { getUrlGoogleMaps } from '../lib/utils';

const OrderAssigned = props => {
	const ctx = useContext(RiderContext);
	const { sendRequest, status } = useHttp(updateOrderStatus);
	const [order, updateOrder] = useState(props.order);
	const [show, setShow] = useState(false);

	let newStatus = '';
	let action = '';
	const fulfill = moment(
		order.times.find(time => {
			return time.action === 'fulfill_at';
		}).by
	);

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
			<Card key={order._id}>
				<Card.Header></Card.Header>
				<Card.Body>
					<Button
						style={{ position: 'absolute', right: '10px' }}
						onClick={handleShow}
					>
						<i className='fas fa-cog'></i>
					</Button>
					<Card.Title>{order.status}</Card.Title>
					<Card.Text>
						{`Entrega: ${fulfill.tz('Europe/Madrid').format('LT')}`}
						{forLater}
					</Card.Text>
					<Card.Text>{order.client.name}</Card.Text>
					<Card.Text>{order.client.phone}</Card.Text>
					<Card.Text onClick={openGoogleHandler}>
						{order.address.street}
					</Card.Text>
					{order.address.floor && (
						<Card.Text>{order.address.floor}</Card.Text>
					)}
					<Card.Text>{`${order.address.zipcode} ${order.address.city}`}</Card.Text>
					<Card.Text>{order.payment}</Card.Text>
					<Button variant='primary' onClick={updateStatusHandler}>
						Siguiente
					</Button>
				</Card.Body>
			</Card>
			<OrderOptions show={show} onClose={handleClose} order={order} />
		</Fragment>
	);
};

export default OrderAssigned;
