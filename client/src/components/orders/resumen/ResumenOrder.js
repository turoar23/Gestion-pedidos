import { useState, Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment-timezone';

import ModalOrder from '../ModalOrder';

function getTimeFromOrder(times, action) {
	let time = times.find(element => element.action === action);
	return time ? time.by : null;
}

function formatTime(time) {
	return (time = time ? moment(time).tz('Europe/Madrid').format('LT') : '--');
}
function differentTwoDate(begin, end) {
	if (!begin || !end) return '--';
	// Remove the seconds and milliseconds to ensure that dosent affect the diff
	begin = moment(begin).seconds(0).milliseconds(0);
	end = moment(end).seconds(0).milliseconds(0);

	return Math.round(moment.duration(end.diff(begin)).asMinutes());
}

// Component
const ResumenOrder = props => {
	const [showOrderInfo, setShowOrderInfo] = useState(false);

	const handleCloseOrderInfo = () => setShowOrderInfo(false);
	const handleShowOrderInfo = () => setShowOrderInfo(true);

	const accepted_at = getTimeFromOrder(props.order.times, 'accepted_at');
	const delivering = getTimeFromOrder(props.order.times, 'Start delivering');
	const arrived = getTimeFromOrder(props.order.times, 'Arrived destination');
	const completed = getTimeFromOrder(props.order.times, 'Completed');
	const fulfill_at = getTimeFromOrder(props.order.times, 'fulfill_at');
	const success = differentTwoDate(completed, fulfill_at);

	const successColor =
		typeof success === 'number'
			? success > 0
				? 'green'
				: success > -15 && props.order.for_later
				? 'orange'
				: 'red'
			: 'black';

	return (
		<Fragment>
			<Row className='order'>
				<Col>{props.order.gloriaId || '--'}</Col>
				<Col>{`${props.order.address.street} ${props.order.address.zipcode}`}</Col>
				<Col>{props.order.rider ? props.order.rider.name : '--'}</Col>
				<Col>
					<div>{formatTime(accepted_at)}</div>
					<div>{differentTwoDate(accepted_at, fulfill_at)}</div>
				</Col>
				<Col>
					<div>{formatTime(delivering)}</div>
					<div>{differentTwoDate(accepted_at, delivering)}</div>
				</Col>
				<Col>
					<div>{formatTime(arrived)}</div>
					<div>{differentTwoDate(delivering, arrived)}</div>
				</Col>
				<Col>
					<div>{formatTime(completed)}</div>
					<div>{differentTwoDate(arrived, completed)}</div>
				</Col>
				<Col>
					<div>
						{formatTime(fulfill_at)}
						{props.order.for_later === true && (
							<sup className='for-later'>P</sup>
						)}
					</div>
					<div><span style={{ color: successColor }}>{success}</span> / {differentTwoDate(accepted_at, completed)}</div>
				</Col>
				<Col>
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
		</Fragment>
	);
};
export default ResumenOrder;
