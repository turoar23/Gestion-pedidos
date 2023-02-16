import React, { useRef } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

export default function ModalRestaurant(props) {
  const restaurant = props.restaurant;
  const isEdit = !!restaurant;

  const nameRef = useRef();
  const phoneRef = useRef();
  const streetRef = useRef();
  const cityRef = useRef();
  const zipcodeRef = useRef();
  const countryRef = useRef();
  const globalEmailRef = useRef();
  const mainColorRef = useRef();
  const gloriaFoodRef = useRef();

  const handleConfirm = () => {
    const name = nameRef.current.value;
    const phone = phoneRef.current.value;
    const street = streetRef.current.value;
    const city = cityRef.current.value;
    const zipcode = zipcodeRef.current.value;
    const country = countryRef.current.value;

    console.log({
      name,
      phone,
      street,
      city,
      zipcode,
      country,
    });

    props.handleClose();
  };

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? 'Editar' : 'Nuevo'} restaurante</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Nombre</Form.Label>
              <Form.Control type='text' ref={nameRef} defaultValue={restaurant?.name} required />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Teléfono</Form.Label>
              <Form.Control type='text' ref={phoneRef} defaultValue={restaurant?.phone} required />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Calle</Form.Label>
              <Form.Control
                type='text'
                ref={streetRef}
                defaultValue={restaurant?.address.street}
                required
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Ciudad</Form.Label>
              <Form.Control
                type='text'
                ref={cityRef}
                defaultValue={restaurant?.address.city}
                required
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Código postal</Form.Label>
              <Form.Control
                type='text'
                ref={zipcodeRef}
                defaultValue={restaurant?.address.zipcode}
                required
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>País</Form.Label>
              <Form.Select ref={countryRef}>
                <option value='spain'>España</option>
              </Form.Select>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Email Global</Form.Label>
              <Form.Control
                type='email'
                ref={globalEmailRef}
                defaultValue={restaurant?.emails.global}
                required
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Color principal</Form.Label>
              <Form.Control
                type='color'
                placeholder='#000000'
                ref={mainColorRef}
                defaultValue={restaurant?.colors.mainColor}
                required
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>GloriaFood API Key</Form.Label>
              <Form.Control
                type='text'
                ref={gloriaFoodRef}
                defaultValue={
                  restaurant?.integrations.find(integration => integration.name === 'GloriaFood')
                    ?.key
                }
              />
            </Form.Group>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={props.handleClose}>
          Cerrar
        </Button>
        <Button variant='primary' onClick={handleConfirm}>
          {isEdit ? 'Guardar cambios' : 'Crear'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
