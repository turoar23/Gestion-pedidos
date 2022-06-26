import { Nav, Navbar } from 'react-bootstrap';
import { getUser } from '../../lib/jwt';

const Navigation = () => {
  const user = getUser();

  return (
    <Navbar expand={false}>
      <Nav className='justify-content-end flex-grow-1 pe-3'>
        <Nav.Link href='/admin'>Home</Nav.Link>
        <Nav.Link href='/admin/orders'>Pedidos</Nav.Link>
        {user.role === 'Admin' && <Nav.Link href='/admin/reporting/resumen'>Informe resumen</Nav.Link>}
        <Nav.Link href='/admin/reporting'>Informe pedidos</Nav.Link>
        <Nav.Link href='/admin/reviews'>Reseñas</Nav.Link>
        {user.role === 'Admin' && <Nav.Link href='/admin/riders'>Riders</Nav.Link>}
        {user.role === 'Admin' && <Nav.Link href='/admin/users'>Usuarios</Nav.Link>}
      </Nav>
    </Navbar>
  );
};

export default Navigation;
