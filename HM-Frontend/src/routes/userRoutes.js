import { useRoutes } from 'react-router-dom';

// routes
import userMainRoutes from './userMainRoutes';
import userAuthenticationRoutes from './userAuthenticationRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([userMainRoutes, userAuthenticationRoutes]);
}
