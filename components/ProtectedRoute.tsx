
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

interface Props {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'INSTITUTION' | 'SCHOLAR' | 'USER';
}

const ProtectedRoute: React.FC<Props> = ({ children, requiredRole }) => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'ADMIN') {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
