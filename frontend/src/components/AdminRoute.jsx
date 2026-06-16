import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import LoadingSpinner from './LoadingSpinner';

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}
