import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import useHttp from '../../hooks/use-http';
import { getRestaurants } from '../../lib/api/restaurants-api';

export default function ModalZone(props) {
  const { sendRequest, status, data, error } = useHttp(getRestaurants, true);
  const zone = props.zone;
  const isEdit = !!zone;
  const [zoneRestaurants, setZoneRestaurants] = useState([]);
  // const [restaurantsAvailable, setRestaurantsAvailable] = useState([]);
  let restaurantsAvailable = [];
  console.log(zoneRestaurants);

  const nameRef = useRef();
  const phoneRef = useRef();

  useEffect(() => {
    sendRequest();

    if (zone) setZoneRestaurants(zone.resturants);
  }, []);

  // useEffect(() => {
  //   setZoneRestaurants(zone.restaurants);
  // }, [zone]);

  if (status === 'completed' && !error) {
    const newListRestaurants = data.filter(
      restaurant =>
        zoneRestaurants.find(zoneRestaurant => zoneRestaurant === restaurant._id) === undefined
    );

    restaurantsAvailable = newListRestaurants;
  }

  const handleConfirm = () => {
    const name = nameRef.current.value;
    const phone = phoneRef.current.value;

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
              <Form.Control type='text' ref={nameRef} defaultValue={zone?.name} required />
            </Form.Group>
          </Row>
          <Row>
            <Form.Select>
              {restaurantsAvailable.map(restaurant => (
                <option key={restaurant._id} value={restaurant._id}>
                  {restaurant.name}
                </option>
              ))}
            </Form.Select>
          </Row>
          {/* <Row>
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
                type='text'
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
          </Row> */}
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
