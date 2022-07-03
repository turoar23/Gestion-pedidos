import { Navigate, Outlet } from 'react-router-dom';

import { getUser } from '../jwt';
import MainContainer from '../../layout/restaurants/MainContainer';

const RequireAuth = ({ children }) => {
  const isLogged = !!getUser();

  if (!isLogged) return <Navigate to={'/login'} replace />;

  return children ? (
    children
  ) : (
    <MainContainer>
      <Outlet />
    </MainContainer>
  );
};

export default RequireAuth;
