import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export const ConfirmModal = props => {
  // const [show, setShow] = useState(props.show || false);
  const show = props.show || false;

  const handleClose = () => {
    // setShow(false);
    props.onClose(false);
  };

  const handleCloseConfirm = () => {
    // setShow(false);
    props.onClose(true);
  };

  // const handleShow = () => setShow(true);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmación</Modal.Title>
      </Modal.Header>
      <Modal.Body>¿Estas seguro/a?</Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant='primary' onClick={handleCloseConfirm}>
          Si
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
