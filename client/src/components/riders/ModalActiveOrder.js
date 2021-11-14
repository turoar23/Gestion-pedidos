import { Modal } from 'react-bootstrap';
import { useEffect, useContext } from 'react';

import useHttp from '../hooks/use-http';
import OrderForAssign from './OrderForAssign';
import RiderContext from '../../store/rider-context';
import { getOrdersWithoutRiders, assignRider } from '../lib/api';

const ModalActiveOrder = props => {
	const { sendRequest, data, status } = useHttp(getOrdersWithoutRiders, true);

	//TODO: Arreglar, tambien se llama cuando se cierra el modal
	useEffect(() => {
		if (props.show) sendRequest();
	}, [sendRequest, props.show]);

	const handleClose = () => {
		props.onClose();
	};

	let listOfOrders = <p>No hay pedidos pendientes</p>;

	if (status === 'completed') {
		listOfOrders = data.map(order => (
			<OrderForAssign
				key={order._id}
				order={order}
				onClose={handleClose}
			/>
		));
	}

	return (
		<Modal
			show={props.show}
			fullscreen={true}
			onHide={props.onClose}
			style={{ textAlign: 'center' }}
		>
			<Modal.Header closeButton>
				<Modal.Title>Pedidos pendientes por asignar</Modal.Title>
			</Modal.Header>
			<Modal.Body>{listOfOrders}</Modal.Body>
		</Modal>
	);
};

export default ModalActiveOrder;
