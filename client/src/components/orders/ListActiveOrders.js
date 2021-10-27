import { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import ActiveOrder from './ActiveOrder';
import useHttp from '../hooks/use-http';
import { getAllActiveOrders } from '../lib/api';

const ListActiveOrders = () => {
	const {
		sendRequest,
		data: loadedOrders,
		status,
	} = useHttp(getAllActiveOrders);

	useEffect(() => {
		sendRequest();
	}, [sendRequest]);

	let listOfActivesOrders = null;

	if (status === 'completed') {
		listOfActivesOrders = loadedOrders.map(order => (
			<ActiveOrder key={order._id} order={order} />
		));
	}

	return (
		<Container fluid>
			<Row className="order">
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
            {listOfActivesOrders}
		</Container>
	);
};

export default ListActiveOrders;
