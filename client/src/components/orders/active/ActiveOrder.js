import { useState, Fragment, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment-timezone';

import ModalRider from '../ModalRider';
import ModalOrder from '../ModalOrder';
import useHttp from '../../hooks/use-http';
import { updateOrder, updateOrderStatus } from '../../lib/api';
import { getUrlGoogleMaps } from '../../lib/utils';

import classes from './ActiveOrder.module.css';

const ActiveOrders = props => {
	const [order, setOrder] = useState(props.order);
	const [showRider, setShowRider] = useState(false);
	const [showOrderInfo, setShowOrderInfo] = useState(false);
	const [showOrderInfoToEdit, setShowOrderInfoToEdit] = useState(false);
	const [momentToCompare, setMomentToCompare] = useState(moment());
	const { sendRequest, status } = useHttp(updateOrder);
	const { sendRequest: sendRequestUpdateStatus, status: statusOrder } =
		useHttp(updateOrderStatus);

	useEffect(() => {
		setInterval(() => {
			setMomentToCompare(moment());
		}, 60 * 1000);
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

	const completeOrderManuallyHandler = async () => {
		await sendRequestUpdateStatus({
			_id: order._id,
			status: 'Completed',
			action: 'Completed Manually',
		});

		handleCloseOrderInfoToEdit();
	};
	const openGoogleHandler = () => {
		window.open(
			getUrlGoogleMaps(
				order.address.street,
				order.address.zipcode,
				order.restaurant
			)
		);
	};

	return (
		<Fragment>
			<Row className='order'>
				<Col className={classes.col}>{order.gloriaId || '--'}</Col>
				<Col
					className={classes.col}
				>{`${order.address.street} ${props.order.address.zipcode}`}</Col>
				<Col className={classes.col}>
					{fulfill.tz('Europe/Madrid').format('LT')}{' '}
					{order.for_later && <sup className='for-later'>P</sup>}
				</Col>
				<Col className={classes.col}>{duration}</Col>
				<Col
					className={`${classes.col} ${
						durationExtra > 0 ? 'danger' : ''
					}`}
				>
					{durationExtra}
				</Col>
				<Col className={classes.col}>{order.restaurant}</Col>
				<Col className={classes.col}>
					{order.rider ? order.rider.name : '--'}
				</Col>
				<Col className={`${classes.col} ${order.status.toLowerCase()}`}>
					{order.status}
				</Col>
				<Col className={classes.col}>
					<i
						className='fas fa-motorcycle'
						onClick={handleShowRider}
					></i>
					<i
						className='far fa-edit'
						style={{ marginLeft: '8px' }}
						onClick={handleShowOrderInfoToEdit}
					></i>
					<i
						className='fas fa-info'
						style={{ marginLeft: '8px' }}
						onClick={handleShowOrderInfo}
					></i>
					<div onClick={openGoogleHandler}>
						<i className={'fas fa-map-marked-alt'}></i>
					</div>
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
				completeOrder={completeOrderManuallyHandler}
			/>
		</Fragment>
	);
};
export default ActiveOrders;
