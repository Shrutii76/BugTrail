import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children?: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Wait until AuthContext finishes restoring the session.
  if (isLoading) {
    return (
      <div className="auth-loading" role="status" aria-live="polite">
        <span className="auth-loading-spinner" />
        <p>Restoring your session...</p>
      </div>
    );
  }

  // Redirect unauthenticated users to login.
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Support both children-based and nested routes.
  return children ? <>{children}</> : <Outlet />;
}
