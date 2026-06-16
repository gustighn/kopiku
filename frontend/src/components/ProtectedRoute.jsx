import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return <LoadingSpinner />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
