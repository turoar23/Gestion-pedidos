import { Nav, Navbar } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import { getUser } from '../../lib/jwt';

const Navigation = () => {
  const user = getUser();
  const location = useLocation();
  const path = location.pathname;

  return (
    <Navbar expand={false}>
      <Nav className='justify-content-end flex-grow-1 pe-3'>
        <Nav.Link href='/' className={path === '/' ? 'active' : ''}>
          Home
        </Nav.Link>
        <Nav.Link href='/orders' className={path === '/orders' ? 'active' : ''}>
          Pedidos
        </Nav.Link>
        {user.role === 'Admin' && (
          <Nav.Link
            href='/reporting/resumen'
            className={path === '/reporting/resumen' ? 'active' : ''}
          >
            Informe resumen
          </Nav.Link>
        )}
        <Nav.Link href='/reporting' className={path === '/reporting' ? 'active' : ''}>
          Informe pedidos
        </Nav.Link>
        <Nav.Link href='/reviews' className={path === '/reviews' ? 'active' : ''}>
          Reseñas
        </Nav.Link>
        {user.role === 'Admin' && (
          <>
            <Nav.Link href='/riders' className={path === '/riders' ? 'active' : ''}>
              Riders
            </Nav.Link>
            <Nav.Link href='/users' className={path === '/users' ? 'active' : ''}>
              Usuarios
            </Nav.Link>
            <Nav.Link href='/restaurants' className={path === '/restaurants' ? 'active' : ''}>
              Restaurantes
            </Nav.Link>
          </>
        )}
      </Nav>
    </Navbar>
  );
};

export default Navigation;
