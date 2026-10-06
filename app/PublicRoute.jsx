// PublicRoute.jsx
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : element;
};

export default PublicRoute;
