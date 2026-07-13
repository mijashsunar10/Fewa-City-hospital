import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-10 h-10 border-4 border-slate-300 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    const isAdminRoute = allowedRoles && allowedRoles.includes('admin');
    return <Navigate to={isAdminRoute ? '/admin/login' : '/login'} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/patient/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
