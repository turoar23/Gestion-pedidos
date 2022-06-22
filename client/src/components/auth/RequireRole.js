import { Redirect } from 'react-router-dom';
import jwt from 'jwt-decode';
import { getJwt } from '../lib/jwt';

function RequireRole({role, children }) {
  const token = getJwt();
  const user = jwt(token).user;

  // console.log(user.role);
  return user.role === role ? children : <Redirect to='/404' replace />;
  // return children;
}

export default RequireRole;
