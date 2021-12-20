import { Card, Button } from 'react-bootstrap';
import moment from 'moment-timezone';

import { useContext } from 'react';
import RiderContext from '../../store/rider-context';

const OrderForAssign = props => {
    const ctx = useContext(RiderContext);
    const order = props.order;

    const handleAssign = () =>{
        props.onClose();
        ctx.addNewOrder(order._id);
    }
	const fulfill = moment(
		order.times.find(time => {
			return time.action === 'fulfill_at';
		}).by
	);
	let forLater = '';
	if (typeof order.for_later !== 'undefined')
		forLater = order.for_later ? <sup className="for-later">P</sup> : '';

	return (
		<Card>
			<Card.Header as='h5'></Card.Header>
			<Card.Body>
				<h5>
					{`${order.restaurant} - ${fulfill
						.tz('Europe/Madrid')
						.format('LT')}`}
					{forLater}
				</h5>
				<p>
					{order.address.street} {order.address.floor}
				</p>
				<p>
					{order.address.zipcode} {order.address.city}
				</p>
				<Button variant='primary' onClick={handleAssign}>
					Asignar
				</Button>
			</Card.Body>
		</Card>
	);
};

export default OrderForAssign;
