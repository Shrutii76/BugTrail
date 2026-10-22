import { Navigate, Route, Routes, Link } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import { AppLayout } from "../components/layout";
import type { ElementType } from "react";

import {
  Bug,
  Activity,
  GitBranch,
  BarChart3,
  Users,
  Bell,
  Settings,
  ShieldAlert,
  FileQuestion,
} from "lucide-react";

type PlaceholderPageProps = {
  title: string;
  description: string;
  icon: ElementType;
  action?: {
    label: string;
    to: string;
  };
};

function PlaceholderPage({
  title,
  description,
  icon: Icon,
  action,
}: PlaceholderPageProps) {
  return (
    <section className="bt-placeholder-page">
      <div className="bt-placeholder-icon">
        <Icon size={26} />
      </div>

      <p className="bt-eyebrow">BUGTRAIL WORKSPACE</p>
      <h1>{title}</h1>
      <p className="bt-placeholder-description">{description}</p>

      {action && (
        <Link className="bt-primary-button" to={action.to}>
          {action.label}
        </Link>
      )}
    </section>
  );
}

function NotFoundPage() {
  return (
    <PlaceholderPage
      title="Page not found"
      description="The page you're looking for doesn't exist or may have moved."
      icon={FileQuestion}
      action={{ label: "Back to dashboard", to: "/dashboard" }}
    />
  );
}

function UnauthorizedPage() {
  return (
    <PlaceholderPage
      title="Access denied"
      description="You don't have permission to access this page. Contact your workspace administrator if you think this is a mistake."
      icon={ShieldAlert}
      action={{ label: "Back to dashboard", to: "/dashboard" }}
    />
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected routes share one application layout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/bugs"
          element={
            <PlaceholderPage
              title="All Bugs"
              description="Browse, filter, and manage reported bugs across your workspace."
              icon={Bug}
              action={{ label: "Report a bug", to: "/bugs/new" }}
            />
          }
        />

        <Route
          path="/bugs/new"
          element={
            <PlaceholderPage
              title="Report a Bug"
              description="Record the issue, reproduction steps, severity, and affected repository."
              icon={Bug}
            />
          }
        />

        <Route
          path="/bugs/:bugId"
          element={
            <PlaceholderPage
              title="Bug Details"
              description="Inspect the report, status, comments, and related development events."
              icon={Bug}
            />
          }
        />

        <Route
          path="/timeline"
          element={
            <PlaceholderPage
              title="Bug Timeline"
              description="Trace bug reports through code changes and development events."
              icon={Activity}
            />
          }
        />

        <Route
          path="/repositories"
          element={
            <PlaceholderPage
              title="Repositories"
              description="Manage project repositories and prepare for GitHub integration."
              icon={GitBranch}
            />
          }
        />

        <Route
          path="/analytics"
          element={
            <PlaceholderPage
              title="Analytics"
              description="Review bug trends, resolution times, and team activity."
              icon={BarChart3}
            />
          }
        />

        <Route
          path="/team"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <PlaceholderPage
                title="Team Management"
                description="Manage workspace members and their access permissions."
                icon={Users}
              />
            </RoleRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <PlaceholderPage
              title="Notifications"
              description="Review updates about bugs, assignments, and workspace activity."
              icon={Bell}
            />
          }
        />

        <Route
          path="/settings"
          element={
            <PlaceholderPage
              title="Settings"
              description="Configure your BugTrail workspace and preferences."
              icon={Settings}
            />
          }
        />

        <Route
          path="/profile"
          element={
            <PlaceholderPage
              title="My Profile"
              description="View and manage your account details."
              icon={Users}
            />
          }
        />
      </Route>

      {/* Unknown routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
