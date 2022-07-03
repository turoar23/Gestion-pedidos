import { Col, ListGroup, Row } from 'react-bootstrap';
import { useState } from 'react';

import ModalOrder from '../../ModalOrder';

import {
	getTimeFromOrder,
	formatTime,
	differentTwoDate,
} from '../../../../lib/utils';

const Order = props => {
	const [showOrderInfo, setShowOrderInfo] = useState(false);

	const handleCloseOrderInfo = () => setShowOrderInfo(false);
	const handleShowOrderInfo = () => setShowOrderInfo(true);

	const order = props.order;

	const fulfill_at = getTimeFromOrder(order.times, 'fulfill_at');
	const completed = getTimeFromOrder(order.times, 'Completed');
	const accepted_at = getTimeFromOrder(props.order.times, 'accepted_at');

	const success = differentTwoDate(completed, fulfill_at);

	const successColor =
		typeof success === 'number'
			? success >= 0
				? 'green'
				: success >= -15 && props.order.for_later
				? 'orange'
				: 'red'
			: 'black';

	return (
		<ListGroup.Item>
			<Row>
				<Col>{order.gloriaId || '--'}</Col>
				<Col>{order.restaurant}</Col>
				<Col>{order.rider ? order.rider.name : '--'}</Col>
				<Col>
					<div>
						{formatTime(completed)} / {formatTime(fulfill_at)}
						{props.order.for_later === true && (
							<sup className='for-later'>P</sup>
						)}
					</div>
				</Col>
				<Col>
					<div>
						<span style={{ color: successColor }}>{success}</span> /{' '}
						{differentTwoDate(accepted_at, completed)}
					</div>
				</Col>
				<Col xs={1}>
					<i
						className='fas fa-info'
						onClick={handleShowOrderInfo}
					></i>
				</Col>
			</Row>
			<ModalOrder
				show={showOrderInfo}
				handleClose={handleCloseOrderInfo}
				order={props.order}
				edit={false}
			/>
		</ListGroup.Item>
	);
};

export default Order;
