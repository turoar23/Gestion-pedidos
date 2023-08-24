import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import useHttp from '../../hooks/use-http';
import { getRestaurants, removeRestaurant } from '../../lib/api/restaurants-api';
import ModalRestaurant from './ModalRestaurant';

const ListRestaurants = () => {
  const { sendRequest, status, data: restaurantsData, error } = useHttp(getRestaurants, true);
  const [showModal, setShowModal] = useState(false);
  const [restaurantEdit, setRestaurantEdit] = useState(undefined);
  // let restaurants = <></>;
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    sendRequest();
  }, []);

  useEffect(() => {
    if (status === 'completed' && !error) setRestaurants(restaurantsData);
  }, [status]);

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

  const onCreateRestaurant = restaurant => {
    const restaurantsUpdated = [...restaurants, restaurant];

    setRestaurants(restaurantsUpdated);
  };

  const onUpdateRestaurant = restaurant => {
    const restaurantIndex = restaurants.findIndex(rest => rest._id === restaurant._id);

    if (restaurantIndex !== -1) {
      const restaurantsUpdated = [...restaurants];
      restaurantsUpdated[restaurantIndex] = restaurant;

      setRestaurants(restaurantsUpdated);
    } else console.error('Error, cant find the restaurant by the _id');
  };

  const handleRemove = restaurantId => {
    removeRestaurant(restaurantId)
      .then(() => {
        const restaurantIndex = restaurants.findIndex(rest => rest._id === restaurantId);

        if (restaurantIndex !== -1) {
          const restaurantsUpdated = [...restaurants];
          restaurantsUpdated.splice(restaurantIndex, 1);

          setRestaurants(restaurantsUpdated);
        } else console.error('Error, cant find the restaurant by the _id');
      })
      .catch(err => {
        console.error('Cant remove restaurant', err);
      });
  };

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
        <tbody>
          {restaurants.map(restaurant => (
            <tr key={restaurant._id}>
              <td>{restaurant.internalName || restaurant.name}</td>
              <td>{restaurant.address.street}</td>
              <td>{restaurant.address.city}</td>
              <td>{restaurant.phone}</td>
              <td>{restaurant.emails.global}</td>
              <td>
                <i
                  className="far fa-edit"
                  style={{ marginLeft: '8px' }}
                  onClick={() => {
                    handleEditModal(restaurant);
                  }}
                ></i>
                <i className="fas fa-trash-alt" aria-hidden="true" onClick={() => handleRemove(restaurant._id)}></i>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ModalRestaurant
        show={showModal}
        handleClose={handleCloseModal}
        restaurant={restaurantEdit}
        onCreateRestaurant={onCreateRestaurant}
        onUpdateRestaurant={onUpdateRestaurant}
      />
    </>
  );
};

export default ListRestaurants;
