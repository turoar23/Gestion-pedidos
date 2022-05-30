import moment from 'moment-timezone';
import { useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import RiderContext from '../../../store/rider-context';

import classes from './OrderOptions.module.css';

const OrderOptions = props => {
	const ctx = useContext(RiderContext);
	const order = props.order;

	const fulfill = moment(
		order.times.find(time => {
			return time.action === 'fulfill_at';
		}).by
	);

	const handleDesassign = () => {
		props.onClose();
		ctx.removeOrder(order._id);
	};
	let forLater = '';
	if (typeof order.for_later !== 'undefined')
		forLater = order.for_later ? <sup className='for-later'>P</sup> : '';

	return (
		<Modal
			show={props.show}
			fullscreen={true}
			onHide={props.onClose}
			style={{ textAlign: 'center' }}
		>
			<Modal.Header closeButton>
				<Modal.Title>Opciones del pedido</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className={classes.row}>
					<div className={classes.col1}>ID</div>
					<div className={classes.col2}>
						{' '}
						{order.gloriaId ? order.gloriaId : '--'}
					</div>
				</div>
				<div className={classes.row}>
					<div className={classes.col1}>Entrega</div>
					<div className={classes.col2}>
						{fulfill.tz('Europe/Madrid').format('LT')}
						{forLater}
					</div>
				</div>
				<div className={classes.row}>
					<div className={classes.col1}>Restaurante</div>
					<div className={classes.col2}>{order.restaurant}</div>
				</div>
				<div className={classes.row}>
					<div className={classes.col1}>Cliente</div>
					<div className={classes.col2}>{order.client.name}</div>
				</div>
				<div className={classes.row}>
					<div className={classes.col1}>Teléfono</div>
					<div className={classes.col2}>{order.client.phone}</div>
				</div>
				<div className={classes.row}>
					<div className={classes.col1}>Dirección:</div>
					<div className={classes.col2}>
						{order.address.street}
						{order.address.floor && order.address.floor}
						{`${order.address.zipcode} ${order.address.city}`}
					</div>
				</div>
				<div className={classes.row}>
					<div className={classes.col1}>Método de pago</div>
					<div className={classes.col2}>{order.payment}</div>
				</div>
				<div className={classes.row}>
					<div className={classes.col1}>Precio</div>
					<div className={classes.col2}>{order.total_price ? `${order.total_price.toFixed(2)} €` : '--'}</div>
				</div>
				<Button variant='danger' onClick={handleDesassign} className={classes.button}>
					Rechazar pedido
				</Button>
			</Modal.Body>
		</Modal>
	);
};
export default OrderOptions;
