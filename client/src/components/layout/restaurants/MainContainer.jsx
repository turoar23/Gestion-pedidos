import { Button, Col, Container, Row } from 'react-bootstrap';
import Navigation from './Navigation';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import classes from './MainContainer.module.css';
import { removeJwt } from '../../lib/jwt';

const MainContainer = props => {
  const navigate = useNavigate();
  const [widthNavigation, setWidthNavigation] = useState(2);

  const handleLogout = () => {
    removeJwt();

    navigate('/login');
  };
  const toggleSideNavBar = () => {
    if (widthNavigation === 1) setWidthNavigation(2);
    else setWidthNavigation(1);
  };

  return (
    <Container fluid className={classes.container}>
      <Row style={{ borderBottom: '1px solid gray', padding: '10px', height: '6vh' }}>
        <Col>Azape - Control pedidos</Col>
        <Col className={classes['nav-profile']}>
          <Button onClick={handleLogout}>Logout</Button>
        </Col>
      </Row>
      <Row className={classes.col}>
        <Col xs={1} md={widthNavigation} className={classes.navbar} style={{ height: '100%' }}>
          <span className={`${classes.arrow} ${classes.open}`} onClick={toggleSideNavBar}>
            {widthNavigation === 1 && <i className='fas fa-angle-double-right'></i>}
            {widthNavigation === 2 && <i className='fas fa-angle-double-left'></i>}
          </span>
          <Navigation />
        </Col>
        <Col style={{ overflow: 'auto', height: '100%' }}>{props.children}</Col>
      </Row>
    </Container>
  );
};

export default MainContainer;
