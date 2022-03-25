import { Fragment, useEffect, useRef, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import moment from 'moment';

import ResumenOrders from './ResumenOrders';
import useHttp from '../../hooks/use-http';
import { getOrdersByDate } from '../../lib/api';
import ListOrders from './ListOrders/ListOrders';
import CierreRider from './CierreRider';

const PanelCierre = () => {
	const [selectedDate, setSelectedDate] = useState(
		moment().format('Y-MM-DD')
	);
	const dateRef = useRef();

	// const fecha = '2022-01-11';
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

	const dateChangeHandler = () => {
		setSelectedDate(dateRef.current.value);
	};
	var filteredOrders = [];

	// if(status === 'completed')
	// 	filteredOrders = loadedOrders.filter(order => order.status === 'Completed');

	return (
		<Fragment>
			<div>
				<div>
					Cierre de la jornada Fecha
					<input
						type='date'
						defaultValue={selectedDate}
						ref={dateRef}
						onChange={dateChangeHandler}
					/>
				</div>
				<Row>
					<Col>
						<CierreRider orders={loadedOrders} />
					</Col>
					<Col>
						<ResumenOrders orders={loadedOrders} />
					</Col>
				</Row>
				<Row>
					<ListOrders orders={loadedOrders} />
				</Row>
			</div>
		</Fragment>
	);
};

export default PanelCierre;
