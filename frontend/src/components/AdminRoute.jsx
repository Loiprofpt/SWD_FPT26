import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'Admin' && user?.role !== 'Staff') {
    return <Navigate to="/" replace />;
  }

  return children;
}
