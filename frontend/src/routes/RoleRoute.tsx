import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { UserRole } from "../types/auth";
import { useAuth } from "../contexts/AuthContext";

interface RoleRouteProps {
  allowedRoles: UserRole[];
  children?: ReactNode;
}

export default function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="auth-loading" role="status" aria-live="polite">
        <span className="auth-loading-spinner" />
        <p>Checking permissions...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

 if (!allowedRoles.includes(user.role)) {
   return <Navigate to="/dashboard" replace />;
 }

 if (!user || !allowedRoles.includes(user.role)) {
   return <Navigate to="/unauthorized" replace />;
 }

  return children ? <>{children}</> : null;
}
