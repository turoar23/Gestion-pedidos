import { Fragment } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Navigation from './Navigation';

import classes from './MainContainer.module.css';

const MainContainer = props => {
	return (
		<Container fluid className={classes.container}>
			<Row style={{ borderBottom: '1px solid gray', padding: '10px' }}>
				<Col>Azape - Control pedidos</Col>
			</Row>
			<Row className={classes.col}>
				<Col md={2} className={classes.navbar}>
					<Navigation />
				</Col>
				<Col style={{overflow: 'auto'}}>{props.children}</Col>
			</Row>
		</Container>
	);
};

export default MainContainer;
