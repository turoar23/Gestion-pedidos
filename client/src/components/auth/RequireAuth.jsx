import { Navigate, Outlet } from 'react-router-dom';

import { getUser } from '../lib/jwt';
import MainContainer from '../layout/admin/MainContainer';

const RequireAuth = ({ children }) => {
  const isLogged = !!getUser();

  if (!isLogged) return <Navigate to={'/admin/login'} replace />;

  return children ? (
    children
  ) : (
    <MainContainer>
      <Outlet />
    </MainContainer>
  );
};

export default RequireAuth;
