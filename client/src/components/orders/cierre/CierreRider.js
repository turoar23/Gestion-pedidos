import { ListGroup, Row, Col, Card } from 'react-bootstrap';

const CierreRider = props => {
	const orders = props.orders;

	if (!orders || orders.length === 0) return <p>Sin datos para este día</p>;

	let riders = [];

	orders.forEach(order => {
		if (order.rider) {
			// Si el rider no esta en la lista, lo creamos
			if (!riders[order.rider.name]) {
				riders[order.rider.name] = {
					totalOrders: 0,
					payments: {
						CASH: 0,
						CARD: 0,
						ONLINE: 0,
					},
				};
			}
			// Se actualiza los datos del pedido del rider
			riders[order.rider.name].totalOrders += 1;
			if (order.total_price)
				riders[order.rider.name].payments[order.payment] +=
					order.total_price;
		}
	});

	var riderResumen = [];

	for (let rider in riders) {
		riderResumen.push(
			<ListGroup.Item key={rider}>
				<Row>
					<Col>{rider}</Col>
					<Col>{riders[rider].totalOrders}</Col>
					<Col>{riders[rider].payments.CASH.toFixed(2)}</Col>
					<Col>{riders[rider].payments.CARD.toFixed(2)}</Col>
					<Col>{riders[rider].payments.ONLINE.toFixed(2)}</Col>
				</Row>
			</ListGroup.Item>
		);
	}

	return (
		<Card>
			<Card.Body>
				<Card.Title>Cierre por rider</Card.Title>
				<ListGroup>
					<Row>
						<Col>Rider</Col>
						<Col>Nº pedidos</Col>
						<Col>CASH</Col>
						<Col>CARD</Col>
						<Col>ONLINE</Col>
					</Row>
					{riderResumen}
				</ListGroup>
			</Card.Body>
		</Card>
	);
};

export default CierreRider;
