import { Button, Form, Modal } from 'react-bootstrap';

const ModalForm = props => {
  const isEdit = !!props.isEdit;

  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Form onSubmit={props.onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.children}</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={props.onHide}>
            Cerrar
          </Button>
          <Button variant='primary' type="submit">
            {isEdit ? 'actualizar' : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalForm;
