import { Fragment, useEffect, useRef, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import moment from 'moment';

import ResumenOrder from './ResumenOrder';
import useHttp from '../../hooks/use-http';
import { getOrdersByDate } from '../../lib/api';

const ListResumenOrders = () => {
	const [selectedDate, setSelectedDate] = useState(moment().format('Y-MM-DD'));
	const dateRef = useRef();

	// const fecha = "2021-08-13";
	const fecha = selectedDate;
	
	const date = moment(fecha).add(3, 'hours');
	const begin = date.valueOf();
	const end = date.add(1, 'days').valueOf();

	const {
		sendRequest,
		data: loadedOrders,
		status,
	} = useHttp(getOrdersByDate, true);

	useEffect(() => {
		sendRequest({ begin: begin, end: end });
	}, [sendRequest, end, begin]);

	let listOrders = <div className='centered'>Loading orders...</div>;

	if (status === 'completed' && loadedOrders) {
		if (loadedOrders.length > 0) {
			listOrders = loadedOrders.map(order => (
				<ResumenOrder key={order._id} order={order} />
			));
		} else {
			listOrders = (
				<div className='centered'>
					No hay pedidos para esta fecha :(
				</div>
			);
		}
	}

	const dateChangeHandler = () => {
		setSelectedDate(dateRef.current.value);
	};

	return (
		<Fragment>
			<div>
				<p></p>
				<div>Pedidos de la jornada</div>
				<div>
					Fecha
					<input
						type='date'
						defaultValue={selectedDate}
						ref={dateRef}
						onChange={dateChangeHandler}
					/>
				</div>
				<Container fluid>
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
						<Col xs={1}>Actions</Col>
					</Row>
					{listOrders}
				</Container>
			</div>
		</Fragment>
	);
};

export default ListResumenOrders;
