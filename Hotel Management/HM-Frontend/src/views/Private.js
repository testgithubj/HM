import { Navigate, Outlet } from 'react-router-dom';
import ThemeRoutes from 'routes';

const PrivateRoutes = ({ allowedRoles }) => {
  let token = localStorage.getItem('token');

  return token ? <ThemeRoutes /> : <Navigate to="/" />;
};

export default PrivateRoutes;
