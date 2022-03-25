import moment from 'moment-timezone';
import { useEffect } from 'react';
import socketIOClient from 'socket.io-client';

import Card from '../../UI/Card';
import useHttp from '../../hooks/use-http';
import { getOrdersByDate } from '../../lib/api';
import StatusRider from './StatusRider';

const ENDPOINT = `http://${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}`;

// Solo se actualiza cunado socket le avise
const ListStatusRiders = props => {
	const activeOrders = props.orders;
	const riders = props.riders;
	const date = moment();

	const begin = date.valueOf();
	const end = date.add(1, 'days').valueOf();

	const {
		sendRequest,
		status,
		data: loadedOrders,
	} = useHttp(getOrdersByDate, true);

	useEffect(() => {
		// Primera vez para obtener los datos
		sendRequest({ begin: begin, end: end });

		const socket = socketIOClient(ENDPOINT);

		// Activamos el socket para que se actualice cada nueva actualizacion
		socket.on('Orders', data => {
			sendRequest({ begin: begin, end: end });
		});

		// CLEAN UP THE EFFECT
		return () => socket.disconnect();
		//
	}, []);

	let allOrders = [];

    console.log(loadedOrders)

	// Añadimos las que ya fueron completadas
	if (loadedOrders) allOrders = allOrders.concat(loadedOrders);
	// Añadimos los pedidos en curso
	if (activeOrders) allOrders = allOrders.concat(activeOrders);
    // Quitamos los pedidos sin rider
    allOrders = allOrders.filter(order => order.rider)

	let ordersRiders = [];

	if (allOrders) {
		console.log(allOrders);
		riders.forEach(rider => {
			const data = {
				rider: rider.name,
				orders: allOrders.filter(order => {
					return order.rider.name === rider.name;
				}),
			};
			if (data.orders.length > 0) ordersRiders.push(data);
		});
	}
	console.log(ordersRiders);

	return (
		<Card>
			{ordersRiders.map(data => (
				<StatusRider data={data} />
			))}
		</Card>
	);
};

export default ListStatusRiders;
