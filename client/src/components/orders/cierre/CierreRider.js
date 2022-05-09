import { ListGroup, Row, Col, Card } from 'react-bootstrap';

const CierreRider = props => {
	const orders = props.orders;

	if (!orders || orders.length === 0) return <p>Sin datos para este día</p>;

	let riders = [];
	let cierre = [];

	orders.forEach(order => {
		if (order.rider) {
			// Si no esta el restaurante
			if (!cierre[order.restaurant])
				cierre[order.restaurant] = { riders: [] };
			// Si no esta el rider
			if (!cierre[order.restaurant].riders[order.rider.name]) {
				cierre[order.restaurant].riders[order.rider.name] = {
					totalOrders: 0,
					payments: {
						CASH: 0,
						CARD: 0,
						ONLINE: 0,
					},
				};
			}
			cierre[order.restaurant].riders[order.rider.name].totalOrders += 1;
			if (order.total_price)
				cierre[order.restaurant].riders[order.rider.name].payments[
					order.payment
				] += order.total_price;

			// Si el rider no esta en la lista, lo creamos
			// if (!riders[order.rider.name]) {
			// 	riders[order.rider.name] = {
			// 		totalOrders: 0,
			// 		payments: {
			// 			CASH: 0,
			// 			CARD: 0,
			// 			ONLINE: 0,
			// 		},
			// 	};
			// }
			// Se actualiza los datos del pedido del rider
			// riders[order.rider.name].totalOrders += 1;
			// if (order.total_price)
			// 	riders[order.rider.name].payments[order.payment] +=
			// 		order.total_price;
		}
	});
	// console.log(cierre);

	var riderResumen = [];

	for (let restaurant in cierre) {
		riderResumen.push(
			<ListGroup.Item key={restaurant}>
				<Row>
					<Col>
						<strong>{restaurant}</strong>
					</Col>
				</Row>
			</ListGroup.Item>
		);
		for (let rider in cierre[restaurant].riders) {
			const riderData = cierre[restaurant].riders[rider];
			riderResumen.push(
				<ListGroup.Item key={rider}>
					<Row>
						<Col>{rider}</Col>
						<Col>{riderData.totalOrders}</Col>
						<Col>{riderData.payments.CASH.toFixed(2)}</Col>
						<Col>{riderData.payments.CARD.toFixed(2)}</Col>
						<Col>{riderData.payments.ONLINE.toFixed(2)}</Col>
					</Row>
				</ListGroup.Item>
			);
		}
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
