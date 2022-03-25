import { Modal, Button, ListGroup } from 'react-bootstrap';

const ModalOrder = props => {
	const order = props.order;

	var itemsFiltered = order.items.filter(item =>{
		return item.type === "item";
	})
	var items = null;

	if (itemsFiltered) {
		items = itemsFiltered.map((item, index) => (
			<ListGroup.Item key={index}>
				{item.quantity}x {item.name}
				<div>
					{item.options.map((option) => (
						`${option.name}, `
					))}
				</div>
			</ListGroup.Item>
		));
	}

	return (
		<Modal show={props.show} onHide={props.handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>
					Order: {order.gloriaId ? order.gloriaId : 'Sin ID'}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{items.length > 0 ? <ListGroup>{items}</ListGroup> : 'No items en este pedido (si es un error, contactar con Arturo :D)'}
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={props.handleClose}>
					Cerrar
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ModalOrder;
