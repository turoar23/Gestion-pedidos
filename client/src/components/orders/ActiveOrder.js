import { useState, Fragment, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment-timezone';

import ModalRider from './ModalRider';
import ModalOrder from './ModalOrder';
import useHttp from '../hooks/use-http';
import { updateOrder } from '../lib/api';

const ActiveOrders = props => {
	const [order, setOrder] = useState(props.order);
	const [showRider, setShowRider] = useState(false);
	const [showOrderInfo, setShowOrderInfo] = useState(false);
	const [showOrderInfoToEdit, setShowOrderInfoToEdit] = useState(false);
	const [momentToCompare, setMomentToCompare] = useState(moment());
	const { sendRequest, status } = useHttp(updateOrder);

	useEffect(() => {
		setInterval(() => {
			setMomentToCompare(moment());
		},  60 * 1000);
	}, []);

	const handleCloseRider = () => setShowRider(false);
	const handleShowRider = () => setShowRider(true);

	const handleCloseOrderInfoToEdit = () => setShowOrderInfoToEdit(false);
	const handleShowOrderInfoToEdit = () => setShowOrderInfoToEdit(true);

	const handleCloseOrderInfo = () => setShowOrderInfo(false);
	const handleShowOrderInfo = () => setShowOrderInfo(true);

	const unassignRiderHandler = () => {
		setOrder(prevState => {
			return { ...prevState, rider: null };
		});
	};

	const assignRiderHandler = rider => {
		setOrder(prevState => {
			return { ...prevState, rider: rider };
		});
	};

	const acepted = moment(
		props.order.times.find(time => {
			return time.action === 'accepted_at';
		}).by
	);
	const fulfill = moment(
		props.order.times.find(time => {
			return time.action === 'fulfill_at';
		}).by
	);
	const duration = Math.round(
		moment.duration(momentToCompare.diff(acepted)).asMinutes()
	);
	const durationExtra = Math.round(
		moment.duration(momentToCompare.diff(fulfill)).asMinutes()
	);
	const updateOrderHandler = orderUpdated => {
		sendRequest(orderUpdated);

		handleCloseOrderInfoToEdit();
	};

	return (
		<Fragment>
			<Row className='order'>
				<Col>{order.gloriaId || '--'}</Col>
				<Col>{`${order.address.street} ${props.order.address.zipcode}`}</Col>
				<Col>{fulfill.tz('Europe/Madrid').format('LT')}</Col>
				<Col>{duration}</Col>
				<Col className={durationExtra > 0 ? 'danger' : ''}>{durationExtra}</Col>
				<Col>{order.restaurant}</Col>
				<Col>{order.rider ? order.rider.name : '--'}</Col>
				<Col className={order.status.toLowerCase()}>{order.status}</Col>
				<Col>
					<i
						className='fas fa-motorcycle'
						onClick={handleShowRider}
					></i>
					<i
						className='far fa-edit'
						onClick={handleShowOrderInfoToEdit}
					></i>
					<i
						className='fas fa-info'
						onClick={handleShowOrderInfo}
					></i>
				</Col>
			</Row>
			<ModalRider
				show={showRider}
				handleClose={handleCloseRider}
				riders={props.riders}
				order={order}
				unassignRider={unassignRiderHandler}
				assignRider={assignRiderHandler}
			/>
			<ModalOrder
				show={showOrderInfoToEdit}
				handleClose={handleCloseOrderInfoToEdit}
				order={order}
				edit={true}
				updateOrder={updateOrderHandler}
			/>
			<ModalOrder
				show={showOrderInfo}
				handleClose={handleCloseOrderInfo}
				order={order}
				edit={false}
			/>
		</Fragment>
	);
};
export default ActiveOrders;
