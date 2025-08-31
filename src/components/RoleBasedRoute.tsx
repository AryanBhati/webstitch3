import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles, 
  fallback 
}) => {
  const { auth } = useAuth();

  // Check if user is authenticated
  if (!auth.isAuthenticated || !auth.user) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-red-200 p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  // Check if user has required role
  if (!allowedRoles.includes(auth.user.role)) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-red-200 p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Insufficient Permissions</h2>
          <p className="text-gray-600">
            You don't have permission to access this page. Required role: {allowedRoles.join(' or ')}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Your current role: {auth.user.role}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleBasedRoute;