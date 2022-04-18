import { Fragment, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import useHttp from '../../hooks/use-http';
import { getOrdersByDate } from '../../lib/api';
import { Col, Container, Row, Table } from 'react-bootstrap';
import ResumenOrder from './resumen/ResumenOrder';

const PanelReportingResumenOrders = props => {
	const [selectedBeginDate, setSelectedBeginDate] = useState(
		moment().subtract(1, 'month').format('Y-MM-DD')
	);
	const [selectedEndDate, setSelectedEndDate] = useState(
		moment().format('Y-MM-DD')
	);
	
	const dateBeginRef = useRef();
	const dateEndRef = useRef();

	const {
		sendRequest,
		data: loadedOrders,
		status,
	} = useHttp(getOrdersByDate);

	useEffect(() => {
		sendRequest({
			begin: moment(selectedBeginDate).valueOf(),
			end: moment(selectedEndDate).valueOf(),
		});
	}, [sendRequest, selectedBeginDate, selectedEndDate]);

	const handleUpdateData = () => {
		setSelectedBeginDate(
			moment(dateBeginRef.current.value).format('Y-MM-DD')
		);
		setSelectedEndDate(
			moment(dateEndRef.current.value).format('Y-MM-DD')
		);
		// console.log(moment(dateBeginRef.current.valye).format('Y-MM-DD'));
	};

	let listOrders = <div className='centered'>Loading orders...</div>;
	let pedidosOk = <div>No hay datos</div>;

	if (status === 'completed' && loadedOrders) {
		if (loadedOrders.length > 0) {
			listOrders = loadedOrders.map(order => (
				<ResumenOrder key={order._id} order={order} />
			));
			// Calculate the correct orders
			let dataOrders = [];
			loadedOrders.forEach(order => {
				if (order.rider) {
					// let index = null;
					// if (dataOrders.length > 1)
					let index = dataOrders.findIndex(
						orderData => orderData.name === order.rider.name
					);

					if (index === -1) {
						dataOrders.push({
							name: order.rider.name,
							total: 0,
							correct: 0,
						});
						index = dataOrders.length - 1;
					}
					// Add the data
					dataOrders[index].total = dataOrders[index].total + 1;
					if (order.statusCorrect)
						dataOrders[index].correct =
							dataOrders[index].correct + 1;
				}
			});
			pedidosOk = dataOrders.map(grupo => (
				<tr key={grupo.name}>
					<td>{grupo.name}</td>
					<td>{grupo.correct}</td>
					<td> {grupo.total}</td>
				</tr>
			));
		} else {
			listOrders = (
				<div className='centered'>
					No hay pedidos para esta fecha :(
				</div>
			);
		}
	}

	return (
		<Fragment>
			<div>
				<label>Desde</label>
				<input
					type='date'
					defaultValue={selectedBeginDate}
					ref={dateBeginRef}
					onChange={handleUpdateData}
				/>
				<label>Hasta</label>
				<input
					type='date'
					defaultValue={selectedEndDate}
					ref={dateEndRef}
					onChange={handleUpdateData}
				/>
			</div>
			<div>
				<Container fluid>
					Resumen
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>Rider</th>
								<th>Pedidos correctos</th>
								<th>Total</th>
							</tr>
						</thead>
						<tbody>{pedidosOk}</tbody>
					</Table>
				</Container>
			</div>
			<div>
				<Container fluid>
					Pedidos
					<Row className='order'>
						<Col>ID</Col>
						<Col>Dirección</Col>
						<Col>Restaurante</Col>
						<Col>Rider</Col>
						<Col>Accepted</Col>
						<Col>Delivering</Col>
						<Col>Arrived</Col>
						<Col>Completed</Col>
						<Col>Fulfill</Col>
						<Col>Updated correct</Col>
						<Col xs={1}>Actions</Col>
					</Row>
					{listOrders}
				</Container>
			</div>
		</Fragment>
	);
};

export default PanelReportingResumenOrders;
