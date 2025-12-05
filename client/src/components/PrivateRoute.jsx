import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  // Session validation is now handled automatically by Axios interceptors in lib/api.js
  // Any 401 response will trigger automatic logout and redirect

  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />;
};

export default PrivateRoute;
