import { useRef } from 'react';
import { Form } from 'react-bootstrap';
import { newUser } from '../../lib/api/users-api';

import ModalForm from '../../UI/ModalForm';

const ModalUser = props => {
  const isEdit = !!props.isEdit;
  const usernameRef = useRef();
  const passwordRef = useRef();
  const roleRef = useRef();

  const handleSubmit = async event => {
    event.preventDefault();

    const newUserData = {
      email: usernameRef.current.value,
      password: passwordRef.current.value,
      role: roleRef.current.value,
    };

    const user = await newUser(newUserData);

    props.onNewUser(user);
    props.onHide();
  };
  const handleClose = () => {
    props.onHide();
  };

  return (
    <ModalForm
      onSubmit={handleSubmit}
      show={props.show}
      onHide={handleClose}
      title={isEdit ? 'Editar usuario' : 'Crear usuario nuevo'}
    >
      <Form.Group className='mb-3' controlId='formBasicEmail'>
        <Form.Label>Usuario (Correo)</Form.Label>
        <Form.Control type='email' placeholder='Email' ref={usernameRef} required />
      </Form.Group>
      <Form.Group className='mb-3' controlId='formBasicCheckbox'>
        <Form.Label>Rol</Form.Label>
        <Form.Select aria-label='Default select example' ref={roleRef} required>
          <option value='Admin'>Admin</option>
          <option value='Restaurant'>Restaurante</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className='mb-3' controlId='formBasicPassword'>
        <Form.Label>Contraseña</Form.Label>
        <Form.Control type='password' placeholder='Contraseña' ref={passwordRef} required />
      </Form.Group>
    </ModalForm>
  );
};

export default ModalUser;
