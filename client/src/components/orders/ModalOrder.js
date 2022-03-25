import { Fragment, useContext, useRef, useState } from 'react';
import { Modal, Button, Form, Row, Col, ListGroup } from 'react-bootstrap';
import moment from 'moment';

import OrdersContext from '../../store/orders-context';
import ModalItems from './ModalItems';

const ModalOrder = props => {
	const ctx = useContext(OrdersContext);
	const edit = props.edit;
	const order = props.order;

	const [showItemsInfo, setShowItemsInfo] = useState(false);

	const streetRef = useRef();
	const postalCodeRef = useRef();
	const cityRef = useRef();
	const clientNameRef = useRef();
	const clientPhoneRef = useRef();
	const paymentRef = useRef();

	const handleCloseItemsInfo = () => {
		setShowItemsInfo(false);
	};
	const handleOpenItemsInfo = () => {
		setShowItemsInfo(true);
	};

	const updateOrderHandler = () => {
		// console.log(streetRef.current.value);
		let updatedOrder = { ...order };

		updatedOrder.address.street = streetRef.current.value;
		updatedOrder.address.city = cityRef.current.value;
		updatedOrder.address.zipcode = postalCodeRef.current.value;
		updatedOrder.client.name = clientNameRef.current.value;
		updatedOrder.client.phone = clientPhoneRef.current.value;
		updatedOrder.payment = paymentRef.current.value;

		props.updateOrder(updatedOrder);
	};
	const cancelOrderHandler = () => {
		ctx.cancelOrder(order._id);
		props.handleClose();
	};
	const stepsDetails = order.times.map((time, index) => (
		<ListGroup.Item key={index}>{`${moment(time.by).format('lll')} ${
			time.action
		}`}</ListGroup.Item>
	));

	return (
		<Fragment>
			<Modal show={props.show} onHide={props.handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>
						Order: {order.gloriaId ? order.gloriaId : 'Sin ID'}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{/* <Form> */}
					<fieldset disabled={edit ? '' : 'disabled'}>
						{/* Direccion de entrega */}
						<Form.Group className='mb-3' controlId='address'>
							<Form.Label>Dirección</Form.Label>
							<Form.Control
								type='text'
								defaultValue={order.address.street}
								ref={streetRef}
							/>
						</Form.Group>
						<Row className='mb-3'>
							<Form.Group as={Col} controlId='floor'>
								<Form.Label>Piso</Form.Label>
								<Form.Control
									type='text'
									defaultValue={order.address.floor}
									ref={postalCodeRef}
								/>
							</Form.Group>
							<Form.Group as={Col} controlId='postalCode'>
								<Form.Label>CP</Form.Label>
								<Form.Control
									type='text'
									defaultValue={order.address.zipcode}
									ref={postalCodeRef}
								/>
							</Form.Group>
							<Form.Group as={Col} controlId='ciudad'>
								<Form.Label>Ciudad/Zona</Form.Label>
								<Form.Control
									type='text'
									defaultValue={order.address.city}
									ref={cityRef}
								/>
							</Form.Group>
						</Row>
						{/* Datos del cliente */}
						<Row className='mb-3'>
							<Form.Group as={Col} controlId='clientName'>
								<Form.Label>Nombre</Form.Label>
								<Form.Control
									type='text'
									defaultValue={order.client.name}
									ref={clientNameRef}
								/>
							</Form.Group>
							<Form.Group as={Col} controlId='clientPhone'>
								<Form.Label>Teléfono</Form.Label>
								<Form.Control
									type='text'
									defaultValue={order.client.phone}
									ref={clientPhoneRef}
								/>
							</Form.Group>
						</Row>
						{/* Datos extra */}
						<Form.Group className='mb-3' controlId='restaurant'>
							<Form.Label>Restaurante</Form.Label>
							<Form.Control
								type='text'
								defaultValue={order.restaurant}
								readOnly={true}
							/>
						</Form.Group>
						<Row className='mb-3'>
							<Form.Group as={Col} controlId='payment'>
								<Form.Label>Método de pago</Form.Label>
								<Form.Select
									aria-label='payment-selector'
									ref={paymentRef}
									required={true}
									defaultValue={order.payment}
								>
									{!edit && (
										<option value='ONLINE'>Online</option>
									)}
									<option value='CASH'>Efectivo</option>
									<option value='CARD'>Tarjeta</option>
								</Form.Select>
							</Form.Group>
							<Form.Group as={Col} controlId='price'>
								<Form.Label>Precio</Form.Label>
								<Form.Control
									type='text'
									defaultValue={
										order.total_price
											? `${order.total_price.toFixed(
													2
											  )} €`
											: null
									}
									// ref={cityRef}
								/>
							</Form.Group>
						</Row>
						{/* </Form> */}
						{!edit && <ListGroup>{stepsDetails}</ListGroup>}
					</fieldset>
					{/* See the items of the order */}
					<Button onClick={handleOpenItemsInfo}>Ver Articulos</Button>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={props.handleClose}>
						Cerrar
					</Button>
					{edit && (
						<Fragment>
							<Button
								variant='danger'
								onClick={cancelOrderHandler}
							>
								Cancelar
							</Button>
							<Button
								variant='primary'
								onClick={updateOrderHandler}
							>
								Actualizar
							</Button>
						</Fragment>
					)}
					{!edit && order.status !== 'Completed' && (
						<Button variant='primary' onClick={props.completeOrder}>
							Completar
						</Button>
					)}
				</Modal.Footer>
			</Modal>
			<ModalItems
				show={showItemsInfo}
				handleClose={handleCloseItemsInfo}
				order={order}
			/>
		</Fragment>
	);
};

export default ModalOrder;
