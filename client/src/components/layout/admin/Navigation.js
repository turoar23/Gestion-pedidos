import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import { getUser } from '../../lib/jwt';

const Navigation = () => {
  const user = getUser();
  const location = useLocation();
  const path = location.pathname;

  return (
    <Navbar expand={false}>
      <Nav className='justify-content-end flex-grow-1 pe-3'>
        <Nav.Link href='/admin' className={path === '/admin' ? 'active' : ''}>
          Home
        </Nav.Link>
        <Nav.Link href='/admin/orders' className={path === '/admin/orders' ? 'active' : ''}>
          Pedidos
        </Nav.Link>
        {user.role === 'Admin' && (
          <Nav.Link href='/admin/reporting/resumen' className={path === '/admin/reporting/resumen' ? 'active' : ''}>
            Informe resumen
          </Nav.Link>
        )}
        <Nav.Link href='/admin/reporting' className={path === '/admin/reporting' ? 'active' : ''}>
          Informe pedidos
        </Nav.Link>
        <Nav.Link href='/admin/reviews' className={path === '/admin/reviews' ? 'active' : ''}>
          Reseñas
        </Nav.Link>
        {user.role === 'Admin' && (
          <Nav.Link href='/admin/riders' className={path === '/admin/riders' ? 'active' : ''}>
            Riders
          </Nav.Link>
        )}
        {user.role === 'Admin' && (
          <Nav.Link href='/admin/users' className={path === '/admin/users' ? 'active' : ''}>
            Usuarios
          </Nav.Link>
        )}
      </Nav>
    </Navbar>
  );
};

export default Navigation;
