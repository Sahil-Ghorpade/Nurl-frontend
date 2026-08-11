import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Skeleton from '../components/ui/Skeleton';

export default function PublicOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '3rem 1.25rem' }}>
        <Skeleton height="300px" maxwidth="400px" style={{ margin: '0 auto' }} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
