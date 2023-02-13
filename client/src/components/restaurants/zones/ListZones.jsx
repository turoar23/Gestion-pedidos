import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import useHttp from '../../hooks/use-http';
import { getZones } from '../../lib/api/zones-api';
import ModalZone from './ModalZone';

export const ListZones = () => {
  const { sendRequest, status, data, error } = useHttp(getZones, true);
  const [showModal, setShowModal] = useState(false);
  const [zoneEdit, setZoneEdit] = useState(undefined);

  let zones = <></>;

  useEffect(() => {
    sendRequest();
  }, []);

  const handlCloseModal = () => {
    setShowModal(false);
    setZoneEdit(undefined);
  };

  const handlOpenModal = () => {
    setShowModal(true);
    setZoneEdit(undefined);
  };

  const handleEditModal = zone => {
    setZoneEdit(zone);
    setShowModal(true);
  };

  if (status === 'completed' && !error)
    zones = data.map(zone => (
      <tr key={zone._id}>
        <td>{zone.name}</td>
        <td>{zone.restaurants.length}</td>
        <td>
          <i
            className='far fa-edit'
            style={{ marginLeft: '8px' }}
            onClick={() => {
              handleEditModal(zone);
            }}
          ></i>
        </td>
      </tr>
    ));
  return (
    <>
      <Button onClick={handlOpenModal}>Crear nueva zona</Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Nº restaurantes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>{zones}</tbody>
      </Table>
      <ModalZone show={showModal} handleClose={handlCloseModal} zone={zoneEdit} />
    </>
  );
};

export default ListZones;
