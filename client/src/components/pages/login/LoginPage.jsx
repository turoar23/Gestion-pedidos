import { useRef } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { login } from '../../lib/api';
import { setJwt } from '../../lib/jwt';

const LoginPage = props => {
  const navigate = useNavigate();
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleLogin = async event => {
    event.preventDefault();

    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    try {
      const token = await login(username, password);

      setJwt(token.token);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Row className='justify-content-center align-middle mt-2 mb-2'>
      <Col md={3} xs={11}>
        <h3>Login</h3>
        <Form onSubmit={handleLogin}>
          <Form.Group controlId='formBasicEmail'>
            <Form.Label>Correo</Form.Label>
            <Form.Control type='email' ref={usernameRef} />
          </Form.Group>
          <Form.Group controlId='formBasicPassword'>
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type='password' ref={passwordRef} />
          </Form.Group>
          <Button variant='primary' type='submit' className='mt-2'>
            Iniciar sesión
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default LoginPage;
