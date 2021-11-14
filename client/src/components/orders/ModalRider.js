import { Modal, Button, ListGroup } from 'react-bootstrap';

import useHttp from '../hooks/use-http';
import { assignRider } from '../lib/api';

const ModalRider = props => {
	const { sendRequest, status } = useHttp(assignRider, true);

	const assignHandler = rider => {
		props.handleClose();
		sendRequest({
			riderId: rider._id,
			orderId: props.order._id,
		}).then(() => {
			props.assignRider(rider);
		});
	};
	const unassignRiderHandler = () => {
		props.handleClose();
		sendRequest({
			riderId: null,
			orderId: props.order._id,
		}).then(() => {
			props.unassignRider();
		});
	};

	return (
		<Modal show={props.show} onHide={props.handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Modal heading</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<ListGroup>
					{props.riders.map(rider => (
						<ListGroup.Item
							className='d-flex justify-content-between align-items-start'
							key={rider._id}
						>
							{rider.name}
							<Button
								onClick={assignHandler.bind(null, rider)}
							>
								Asignar
							</Button>
						</ListGroup.Item>
					))}
				</ListGroup>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={props.handleClose}>
					Cerrar
				</Button>
				<Button variant='primary' onClick={unassignRiderHandler}>
					Desasignar
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ModalRider;
