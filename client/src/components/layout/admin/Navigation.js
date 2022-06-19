import { Accordion, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { removeJwt } from '../../lib/jwt';

const Navigation = () => {
	const history = useHistory();

	const handleLogout = () => {
		removeJwt();

		history.push('/login');
	}
	return (
		<Navbar expand={false}>
			<Nav className='justify-content-end flex-grow-1 pe-3'>
				<Nav.Link href='/admin'>Home</Nav.Link>
				{/* <Nav.Link href='/admin/riders'>Riders</Nav.Link> */}
				{/* <NavDropdown title='Riders' id='offcanvasNavbarDropdown'>
					<NavDropdown.Item href='/admin/riders'>
						Listado
					</NavDropdown.Item>
					<NavDropdown.Item href='/admin/riders/resume'>
						Resumen
					</NavDropdown.Item>
				</NavDropdown> */}
				<Nav.Link href="/admin/riders">Riders</Nav.Link>
				<Nav.Link href="/admin/reporting/resumen">Informe resumen</Nav.Link>
				<Nav.Link href="/admin/reporting">Informe pedidos</Nav.Link>
				<Nav.Link href="/admin/reviews">Reseñas</Nav.Link>
				{/* <Nav.Item>
					<Accordion flush={true} alwaysOpen={false}>
						<Accordion.Item eventKey='0'>
							<Accordion.Header as={'div'}>
								Riders
							</Accordion.Header>
							<Accordion.Body></Accordion.Body>
						</Accordion.Item>
					</Accordion>
				</Nav.Item> */}
				<Nav.Item onClick={handleLogout}>
					Logout
				</Nav.Item>
			</Nav>
		</Navbar>
	);
};

export default Navigation;
