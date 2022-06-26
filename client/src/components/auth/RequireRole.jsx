import { Outlet, Navigate } from 'react-router-dom';

const RequireRol = ({ isAllowed, redirectPath = '/admin', children }) => {
  if (!isAllowed) return <Navigate to={redirectPath} replace />;

  return children ? children : <Outlet />;
};

export default RequireRol;
