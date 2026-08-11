import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Skeleton from '../components/ui/Skeleton';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '3rem 1.25rem' }}>
        <Skeleton height="32px" width="200px" style={{ marginBottom: '1.5rem' }} />
        <Skeleton height="120px" style={{ marginBottom: '2rem' }} />
        <Skeleton height="300px" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
