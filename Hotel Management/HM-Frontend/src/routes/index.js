import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import BillRoute from './BillRoute';
import SingleBillRoute from './SingleBillRoute';
import SeparateFoodBillRoute from './SeparateFoodBillRoute';
import SeparateLaundaryBillRoute from './SeparateLaundaryBillRoute';
import { Error } from './Error';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([MainRoutes, AuthenticationRoutes, BillRoute, SingleBillRoute, SeparateFoodBillRoute, SeparateLaundaryBillRoute,Error]);
}
