import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<'student' | 'admin' | 'faculty' | 'counsellor' | 'parent' | 'placement'>;
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading, initialize } = useAuthStore();
  const location = useLocation();

  // Run initialization once on mount to read from LocalStorage
  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white">
        <Loader2 className="h-10 w-10 text-accent-primary animate-spin mb-4" />
        <p className="text-gray-400 text-sm animate-pulse">Initializing session...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Redirect to login but save the current location they tried to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If authenticated but unauthorized role, redirect to their default home dashboard
    const defaultRedirect = `/dashboard/${user.role}`;
    return <Navigate to={defaultRedirect} replace />;
  }

  return <>{children}</>;
}
