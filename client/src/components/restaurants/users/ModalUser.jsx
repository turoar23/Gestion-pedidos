import React from 'react';
import { useRef } from 'react';
import { Form } from 'react-bootstrap';

import { newUser, updateUser } from '../../lib/api/users-api';
import ModalForm from '../../UI/ModalForm';
import RestaurantSelector from './components/RestaurantSelector';

const ModalUser = props => {
  const isEdit = !!props.editUser;
  const usernameRef = useRef();
  const passwordRef = useRef();
  const roleRef = useRef();
  const restaurants = props.restaurants || [];
  let restaurantsSelected = (props.editUser?.restaurants || []).map(restaurant => {
    const restaurantInfo = restaurants.find(restaurantInfo => restaurantInfo._id === restaurant._id);

    if (restaurantInfo) {
      return {
        _id: restaurantInfo._id,
        name: restaurantInfo.name,
        permission: restaurant.permissions,
      };
    }
    return {};
  });

  const handleSubmit = async event => {
    event.preventDefault();

    const newUserData = {
      email: usernameRef.current.value,
      role: roleRef.current.value,
      restaurants: restaurantsSelected.map(restaurant => ({ _id: restaurant._id, permissions: restaurant.permission })),
    };

    let user = null;
    if (!isEdit) {
      newUserData.password = passwordRef.current.value;

      user = await newUser(newUserData);

      props.onNewUser(user);
    } else {
      newUserData._id = props.editUser._id;

      user = await updateUser(newUserData);

      props.onUpdateUser(user);
    }

    props.onHide();
  };

  const handleClose = () => {
    props.onHide();
  };

  const handleUpdateRestaurantList = newList => {
    restaurantsSelected = [...newList];
  };

  return (
    <ModalForm
      onSubmit={handleSubmit}
      show={props.show}
      onHide={handleClose}
      title={isEdit ? 'Editar usuario' : 'Crear usuario nuevo'}
    >
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Usuario</Form.Label>
        <Form.Control
          type="text"
          placeholder="..."
          ref={usernameRef}
          defaultValue={isEdit ? props.editUser.email : ''}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Label>Rol</Form.Label>
        <Form.Select
          aria-label="Default select example"
          ref={roleRef}
          defaultValue={isEdit ? props.editUser.role : ''}
          required
        >
          <option value="Admin">Admin</option>
          <option value="Restaurant">Restaurante</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Label>Restaurantes</Form.Label>
        <RestaurantSelector
          items={restaurants}
          itemsSelected={restaurantsSelected}
          onUpdateList={handleUpdateRestaurantList}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control type="password" placeholder="..." ref={passwordRef} required={!isEdit} disabled={isEdit} />
      </Form.Group>
    </ModalForm>
  );
};

export default ModalUser;
