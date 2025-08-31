import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: string;
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  children, 
  permission, 
  fallback 
}) => {
  const { auth } = useAuth();

  // Check if user is authenticated
  if (!auth.isAuthenticated || !auth.user) {
    return fallback || null;
  }

  // Super Admin has all permissions
  if (auth.user.role === 'Super Admin' || auth.user.permissions.includes('*')) {
    return <>{children}</>;
  }

  // Check if user has specific permission
  if (!auth.user.permissions.includes(permission)) {
    return fallback || null;
  }

  return <>{children}</>;
};

export default PermissionGuard;