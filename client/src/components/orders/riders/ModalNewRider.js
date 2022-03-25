import { Modal, Button, Form } from 'react-bootstrap';
import { useRef } from 'react';

import useHttp from '../../hooks/use-http';
import { newRider } from '../../lib/api';

const ModalRider = props => {
	const { sendRequest, status } = useHttp(newRider);

	// const rider = props.rider;
	const nameRef = useRef();
	const pinRef = useRef();
	const vehicleRef = useRef();

	const createRiderHandler = async event => {
		event.preventDefault();

		let newRider = {
			name: nameRef.current.value,
			code: pinRef.current.value,
			vehicle: vehicleRef.current.value,
		};
		await sendRequest(newRider);

		props.handleClose();
	};

	return (
		<Modal show={props.show} onHide={props.handleClose}>
			<Form onSubmit={createRiderHandler}>
				<Modal.Header closeButton>
					<Modal.Title>Nuevo Rider</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form.Group className='mb-3' controlId='formBasicEmail'>
						<Form.Label>Nombre</Form.Label>
						<Form.Control
							type='text'
							placeholder='...'
							ref={nameRef}
							required
						/>
					</Form.Group>
					<Form.Group className='mb-3' controlId='formBasicPassword'>
						<Form.Label>PIN</Form.Label>
						<Form.Control
							type='number'
							placeholder='1234'
							min={1000}
							max={9999}
							ref={pinRef}
							required
						/>
						<Form.Text className='text-muted'>
							Pin único de 4 digitos de largo
						</Form.Text>
					</Form.Group>
					<Form.Group className='mb-3' controlId='formBasicEmail'>
						<Form.Label>Vehículo</Form.Label>
						<Form.Select ref={vehicleRef} required>
							<option value='Moto'>Moto</option>
							<option value='Coche'>Coche</option>
							<option value='Bicicleta'>Bicicleta</option>
							<option value='Otro'>Otro</option>
						</Form.Select>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={props.handleClose}>
						Cerrar
					</Button>
					<Button variant='primary' type='submit'>
						Crear
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default ModalRider;
