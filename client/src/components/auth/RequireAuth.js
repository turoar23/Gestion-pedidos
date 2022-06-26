import { Outlet, Navigate } from 'react-router-dom';

import MainContainer from '../layout/admin/MainContainer';

function RequireAuth({ isAllowed, redirectPath = '/admin', children }) {
  if (!isAllowed) return <Navigate to={redirectPath} replace />;

  return children ? (
    children
  ) : (
    <MainContainer>
      <Outlet />
    </MainContainer>
  );
}

export default RequireAuth;
