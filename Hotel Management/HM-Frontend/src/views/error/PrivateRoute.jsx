import ErrorPage from './ErrorPage';

const PrivateRoute = ({ children }) => {
  const getUserData = () => {
    const userData = localStorage.getItem('hotelData');
    return userData ? JSON.parse(userData) : null;
  };
  const { role, permissions } = getUserData();

  if (role === 'admin' || role === 'HotelAdmin' || permissions?.length > 0) {
    return children;
  } else {
    return <ErrorPage />;
  }
};

export default PrivateRoute;
