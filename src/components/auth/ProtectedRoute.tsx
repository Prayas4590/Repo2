import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const { currentRole, getRolePath } = useRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated but accessing root protected path, redirect to role dashboard
  if (location.pathname === '/' && currentRole) {
    return <Navigate to={getRolePath()} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;