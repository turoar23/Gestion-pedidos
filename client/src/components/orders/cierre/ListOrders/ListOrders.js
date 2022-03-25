import { Card, ListGroup, Row, Col } from 'react-bootstrap';
import Order from './Order';

const ListOrders = props => {
	const orders = props.orders;

	var listOrders = null;
	if (orders) {
		listOrders = orders.map(order => (
			<Order key={order._id} order={order} />
		));
	}

	return (
		<Card>
			<Card.Body>
				<Card.Title>Pedidos de la jornada</Card.Title>
				<ListGroup>
					<Row>
						<Col>ID</Col>
						<Col>Restaurante</Col>
						<Col>Rider</Col>
						<Col>Completado / Objetivo</Col>
						<Col>Diff / T. Total</Col>
						<Col xs={1}>Actions</Col>
					</Row>
					{listOrders}
				</ListGroup>
			</Card.Body>
		</Card>
	);
};

export default ListOrders;
