import { useEffect } from 'react';

import RiderContext from '../../store/rider-context';
import useHttp from '../hooks/use-http';
import { getActiveRiderOrders, assignRider } from '../lib/api';
import ListRiderOrders from '../riders/ListRiderOrders';
import Header from '../riders/Header';

import classes from './RiderContent.module.css'

const RiderContent = props => {
	const riderName = props.riderName;
	const riderId = props.riderId;
	const { sendRequest, data, status } = useHttp(getActiveRiderOrders, true);
	const { sendRequest: sendAddRider, status: statusAddRider } = useHttp(
		assignRider,
		true
	);

	let orders = [];

	useEffect(() => {
		sendRequest(riderId);
	}, [sendRequest, riderId]);

	// useEffect(() => {
	if (status === 'completed') orders = data;
	// }, [status, data]);

	const updateOrdersHandler = async () => {
		await sendRequest(riderId);
	};
	const removeOrderRiderHandler = async orderId => {
		const body = {
			orderId: orderId,
		};
		await sendAddRider(body);
		await updateOrdersHandler();
	};
	const addOrderRiderHandler = async orderId => {
		const body = {
			orderId: orderId,
			riderId: riderId,
		};
		await sendAddRider(body);
		await updateOrdersHandler();
	};

	return (
		<RiderContext.Provider
			value={{
				riderId: riderId,
				orders: orders,
				updateOrders: updateOrdersHandler,
				addNewOrder: addOrderRiderHandler,
				removeOrder: removeOrderRiderHandler,
			}}
		>
			<div style={{ textAlign: 'center' }}>
				<Header name={riderName} />
				<ListRiderOrders />
			</div>
		</RiderContext.Provider>
	);
};

export default RiderContent;
