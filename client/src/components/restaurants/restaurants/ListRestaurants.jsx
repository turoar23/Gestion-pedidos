import React from 'react';
import { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import useHttp from '../../hooks/use-http';
import { getRestaurants } from '../../lib/api/restaurants-api';

const ListRestaurants = () => {
  const { sendRequest, status, data, error } = useHttp(getRestaurants, true);
  let restaurants = <></>;

  useEffect(() => {
    sendRequest();
  }, []);

  if (status === 'completed' && !error)
    restaurants = data.map(restaurant => (
      <tr key={restaurant._id}>
        <td>{restaurant.name}</td>
        <td>{restaurant.address.street}</td>
        <td>{restaurant.address.city}</td>
        <td>{restaurant.phone}</td>
        <td>{restaurant.emails.global}</td>
      </tr>
    ));
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Dirección</th>
          <th>Ciudad</th>
          <th>Télefono</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>{restaurants}</tbody>
    </Table>
  );
};

export default ListRestaurants;
