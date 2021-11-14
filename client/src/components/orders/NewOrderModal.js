import { useContext, useRef } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

import OrdersContext from '../../store/orders-context';
import useHttp from '../hooks/use-http';
import { newOrder } from '../lib/api';

const NewOrderModal = props => {
	const ctx = useContext(OrdersContext);
	const { sendRequest, status } = useHttp(newOrder);

	const streetRef = useRef();
	const postalCodeRef = useRef();
	const cityRef = useRef();
	const clientNameRef = useRef();
	const clientPhoneRef = useRef();
	const paymentRef = useRef();
	const restaurantRef = useRef();

	const createOrderHandler = async event => {
		event.preventDefault();
		// console.log(streetRef.current.value);
		let newOrder = {
			direction: {
				street: streetRef.current.value,
				city: cityRef.current.value,
				zipcode: postalCodeRef.current.value,
			},
			client: {
				name: clientNameRef.current.value,
				phone: clientPhoneRef.current.value,
			},
			payment: paymentRef.current.value,
			restaurant: restaurantRef.current.value,
		};

		await sendRequest(newOrder);

        ctx.updateOrders();

		props.handleClose();

		// props.newOrder(newOrder);
	};

	return (
		<Modal show={props.show} onHide={props.handleClose}>
			<Form onSubmit={createOrderHandler}>
				<Modal.Header closeButton>
					<Modal.Title>Nuevo pedido</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form.Group className='mb-3' controlId='address'>
						<Form.Label>Dirección</Form.Label>
						<Form.Control
							type='text'
							ref={streetRef}
							required={true}
						/>
					</Form.Group>
					<Row className='mb-3'>
						<Form.Group as={Col} controlId='postalCode'>
							<Form.Label>CP</Form.Label>
							<Form.Control
								type='text'
								ref={postalCodeRef}
								required={true}
							/>
						</Form.Group>
						<Form.Group as={Col} controlId='ciudad'>
							<Form.Label>Ciudad/Zona</Form.Label>
							<Form.Control
								type='text'
								ref={cityRef}
								required={true}
							/>
						</Form.Group>
					</Row>
					{/* Datos del cliente */}
					<Row className='mb-3'>
						<Form.Group as={Col} controlId='clientName'>
							<Form.Label>Nombre</Form.Label>
							<Form.Control
								type='text'
								ref={clientNameRef}
								required={true}
							/>
						</Form.Group>
						<Form.Group as={Col} controlId='clientPhone'>
							<Form.Label>Teléfono</Form.Label>
							<Form.Control
								type='text'
								ref={clientPhoneRef}
								required={true}
							/>
						</Form.Group>
					</Row>
					{/* Datos extra */}
					<Form.Group className='mb-3' controlId='restaurant'>
						<Form.Label>Restaurante</Form.Label>
						<Form.Control
							type='text'
							ref={restaurantRef}
							required={true}
						/>
					</Form.Group>
					<Form.Group className='mb-3' controlId='payment'>
						<Form.Label>Método de pago</Form.Label>
						<Form.Control
							type='text'
							ref={paymentRef}
							required={true}
						/>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={props.handleClose}>
						Cancelar
					</Button>
					<Button variant='primary' type='submit'>
						Crear
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default NewOrderModal;
