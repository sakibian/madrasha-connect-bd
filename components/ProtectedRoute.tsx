
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { PageLoader } from './ui';

type Role = 'ADMIN' | 'INSTITUTION' | 'SCHOLAR' | 'USER';

interface Props {
  children: React.ReactNode;
  /**
   * Role required to access the route. When provided, ADMIN is always allowed
   * (admins can access anything). Accepts a single role or an array of roles.
   */
  requiredRole?: Role | Role[];
}

/**
 * Guards a route by verifying the user is authenticated AND has the required
 * role. Uses the reactive auth store so that logout / role changes propagate
 * immediately without a page reload.
 *
 * - While auth is still initializing, shows a loader (prevents a flash of
 *   "login redirect" on refresh for logged-in users).
 * - Unauthenticated users are redirected to /login, preserving the intended
 *   destination in router state so we can bounce them back post-login.
 * - Authenticated users with the wrong role go to /forbidden.
 * - ADMIN role always satisfies any requiredRole (super-user semantics).
 */
const ProtectedRoute: React.FC<Props> = ({ children, requiredRole }) => {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const loading = useAuthStore((s) => s.loading);

  // Don't render or redirect until auth has resolved. This prevents a hard
  // bounce to /login on hard refresh while the session is being restored.
  if (!initialized || loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.banned) {
    return <Navigate to="/forbidden" replace />;
  }

  if (requiredRole) {
    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasRole = allowed.includes(user.role) || user.role === 'ADMIN';
    if (!hasRole) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
