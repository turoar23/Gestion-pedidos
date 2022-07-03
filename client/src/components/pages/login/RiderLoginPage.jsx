import { useRef, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';

import useHttp from '../../hooks/use-http';
import { getRiderByCode } from '../../lib/api';

const RiderLogin = props => {
  const navigate = useNavigate();
  const codeRef = useRef();
  const { sendRequest, status, data } = useHttp(getRiderByCode, true);
  let error = null;

  const submitHandler = async event => {
    event.preventDefault();
    const code = codeRef.current.value.trim();
    await sendRequest({ code: code });
  };
  useEffect(() => {
    document.title = 'Rider';
  }, []);

  if (status === 'completed') {
    if (data.result) {
      error = null;
      navigate(`/rider`);
      localStorage.setItem('rider', JSON.stringify(data.result));
    } else {
      error = <div>Pin incorrecto</div>;
    }
  }

  return (
    <Row className='justify-content-center align-middle mt-2 mb-2'>
      <Col md={3} xs={11} className='mt-2'>
        <h3>Introduce tu código</h3>
        {error}
        <Form onSubmit={submitHandler}>
          <Form.Group className='mb-3' controlId='formGridAddress1'>
            <Form.Label>Código</Form.Label>
            <Form.Control ref={codeRef} required />
          </Form.Group>
          <Button type='submit'>Iniciar sesión</Button>
        </Form>
      </Col>
    </Row>
  );
};

export default RiderLogin;
