import React, { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import useHttp from '../../hooks/use-http';
import { getZones } from '../../lib/api/zones-api';

export const ListZones = () => {
  const { sendRequest, status, data, error } = useHttp(getZones, true);
  let zones = <></>;

  useEffect(() => {
    sendRequest();
  }, []);

  if (status === 'completed' && !error)
    zones = data.map(zone => (
      <tr key={zone._id}>
        <td>{zone.name}</td>
        <td>{zone.restaurants.length}</td>
      </tr>
    ));
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Nº restaurantes</th>
        </tr>
      </thead>
      <tbody>{zones}</tbody>
    </Table>
  );
};

export default ListZones;
