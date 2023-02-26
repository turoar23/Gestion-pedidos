import { useState } from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';

import useHttp from '../../hooks/use-http';
import ConfirmModal from '../../layout/restaurants/ConfirmModal';
import { assignRider } from '../../lib/api';
import { sendToEpa } from '../../lib/api/orders-api';

const ModalRider = props => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { sendRequest, status } = useHttp(assignRider, true);
  const { sendRequest: sendRequestPartner, status: statusPartner } = useHttp(sendToEpa, true);

  const riders = props.riders.filter(rider => rider.status);

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

  const sendPartnerHandler = () => {
    setShowConfirmation(true);
  };

  const confirmSendPartnerHandler = async val => {
    setShowConfirmation(false);

    if (val === true) {
      // send petition
      await sendRequestPartner(props.order._id);
      props.assignRider('Tookan');
      props.handleClose();
    }
  };

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Riders activos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button onClick={sendPartnerHandler}>Enviar a EPA</Button>
          <ListGroup>
            {riders.map(rider => (
              <ListGroup.Item
                className='d-flex justify-content-between align-items-start'
                key={rider._id}
              >
                {rider.name}
                <Button onClick={assignHandler.bind(null, rider)}>Asignar</Button>
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
      <ConfirmModal show={showConfirmation} onClose={confirmSendPartnerHandler} />
    </>
  );
};

export default ModalRider;
