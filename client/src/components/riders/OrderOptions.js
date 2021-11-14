import { useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import RiderContext from '../../store/rider-context';

const OrderOptions = props => {
    const ctx = useContext(RiderContext);
	const order = props.order;

	const handleDesassign = () => {
        props.onClose();
        ctx.removeOrder(order._id);
    };

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
				<p>ID</p>
				<p>{order.gloriaId ? order.gloriaId : '--'}</p>
                <Button variant="danger" onClick={handleDesassign}>Rechazar pedido</Button>
			</Modal.Body>
		</Modal>
	);
};
export default OrderOptions;
