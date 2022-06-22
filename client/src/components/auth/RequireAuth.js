import { getJwt } from '../lib/jwt';
import { Redirect } from 'react-router-dom';

function RequireAuth({ children }) {
  const isLogged = !!getJwt();

  return isLogged === true ? children : <Redirect to='/admin/login' replace />;
}

export default RequireAuth;
