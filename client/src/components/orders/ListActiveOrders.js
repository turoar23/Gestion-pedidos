import { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

import ActiveOrder from './ActiveOrder';
import useHttp from '../hooks/use-http';
import {
	getAllActiveOrders,
	getAllRiders,
	updateOrderStatus,
} from '../lib/api';
import OrdersContext from '../../store/orders-context';
import NewOrderModal from './NewOrderModal';

import socketIOClient from 'socket.io-client';
const ENDPOINT = 'http://localhost:3000';

const ListActiveOrders = () => {
	const [showNewOrderModal, setShowNewOrderModal] = useState(false);

	// To get All riders
	const {
		sendRequest: sendRequestRiders,
		status: statusRiders,
		data: riders,
	} = useHttp(getAllRiders, true);
	// To get all the active orders
	const {
		sendRequest,
		status,
		data: loadedOrders,
	} = useHttp(getAllActiveOrders, true);
	// To cancel an order
	const { sendRequest: sendRequestCancelOrder, status: statusCancelOrder } =
		useHttp(updateOrderStatus);

	useEffect(() => {
		sendRequestRiders();
		sendRequest();
	}, [sendRequestRiders, sendRequest]);

	useEffect(() => {
		const socket = socketIOClient(ENDPOINT);
		socket.on('Orders', data => {
			console.log(data);
			updateHandler();
		});

		// CLEAN UP THE EFFECT
		return () => socket.disconnect();
		//
	}, []);

	const handleCloseNewOrder = () => setShowNewOrderModal(false);
	const handleShowNewOrder = () => setShowNewOrderModal(true);

	const updateHandler = async () => {
		await sendRequest();
	};

	const cancelOrderHandler = async orderId => {
		await sendRequestCancelOrder({
			_id: orderId,
			status: 'Cancelled',
			action: 'Cancelled Manually',
		});
		await sendRequest();
	};

	if (statusRiders === 'pending') {
		return <div className='centered'>Loading riders...</div>;
	}

	let listOrders = <div className='centered'>Loading orders...</div>;
	if (status === 'completed' && loadedOrders) {
		listOrders = loadedOrders.map(order => (
			<ActiveOrder key={order._id} order={order} riders={riders} />
		));
	}

	return (
		<OrdersContext.Provider
			value={{
				orders: loadedOrders,
				updateOrders: updateHandler,
				cancelOrder: cancelOrderHandler,
			}}
		>
			<Container fluid>
				<div className='actions'>
					<Button onClick={handleShowNewOrder}>Nuevo pedido</Button>
				</div>
				<Row className='order'>
					<Col>ID</Col>
					<Col>Dirección</Col>
					<Col>Entrega</Col>
					<Col>Duración</Col>
					<Col>Restante</Col>
					<Col>Restaurante</Col>
					<Col>Rider</Col>
					<Col>Estado</Col>
					<Col>Actions</Col>
				</Row>
				{listOrders}
				<NewOrderModal
					show={showNewOrderModal}
					handleClose={handleCloseNewOrder}
				/>
			</Container>
		</OrdersContext.Provider>
	);
};

export default ListActiveOrders;
