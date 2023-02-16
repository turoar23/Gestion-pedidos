import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import useHttp from '../../hooks/use-http';
import { getRestaurants } from '../../lib/api/restaurants-api';
import ModalRestaurant from './ModalRestaurant';

const ListRestaurants = () => {
  const { sendRequest, status, data, error } = useHttp(getRestaurants, true);
  const [showModal, setShowModal] = useState(false);
  const [restaurantEdit, setRestaurantEdit] = useState(undefined);
  let restaurants = <></>;

  useEffect(() => {
    sendRequest();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setRestaurantEdit(undefined);
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setRestaurantEdit(undefined);
  };

  const handleEditModal = restaurant => {
    setRestaurantEdit(restaurant);
    setShowModal(true);
  };

  if (status === 'completed' && !error)
    restaurants = data.map(restaurant => (
      <tr key={restaurant._id}>
        <td>{restaurant.name}</td>
        <td>{restaurant.address.street}</td>
        <td>{restaurant.address.city}</td>
        <td>{restaurant.phone}</td>
        <td>{restaurant.emails.global}</td>
        <td>
          <i
            className='far fa-edit'
            style={{ marginLeft: '8px' }}
            onClick={() => {
              handleEditModal(restaurant);
            }}
          ></i>
        </td>
      </tr>
    ));
  return (
    <>
      <Button onClick={handleOpenModal}>Crear nuevo restaurante</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Ciudad</th>
            <th>Télefono</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>{restaurants}</tbody>
      </Table>
      <ModalRestaurant show={showModal} handleClose={handleCloseModal} restaurant={restaurantEdit} />
    </>
  );
};

export default ListRestaurants;
