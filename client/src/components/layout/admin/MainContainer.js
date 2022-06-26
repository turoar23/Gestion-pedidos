import { Col, Container, Row } from 'react-bootstrap';
import Navigation from './Navigation';
import { useNavigate } from 'react-router-dom';

import classes from './MainContainer.module.css';
import { removeJwt } from '../../lib/jwt';

const MainContainer = props => {
	const navigate = useNavigate();

	const handleLogout = () => {
		removeJwt();

		navigate('/admin/login');
	}

	return (
		<Container fluid className={classes.container}>
			<Row style={{ borderBottom: '1px solid gray', padding: '10px' }}>
				<Col>Azape - Control pedidos</Col>
				<Col className={classes['nav-profile']} onClick={handleLogout}>Logout</Col>
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
