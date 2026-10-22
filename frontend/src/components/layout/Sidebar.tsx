import { NavLink } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Bell,
  Bug,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  LayoutDashboard,
  Settings,
  Users,
  X,
} from "lucide-react";

type SidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Bugs", path: "/bugs", icon: Bug },
  { label: "Timeline", path: "/timeline", icon: Activity },
  { label: "Repositories", path: "/repositories", icon: GitBranch },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
];

const workspaceNavigation = [
  { label: "Team", path: "/team", icon: Users },
  { label: "Notifications", path: "/notifications", icon: Bell },
  { label: "Settings", path: "/settings", icon: Settings },
];

export function Sidebar({
  mobileOpen,
  onClose,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="bt-sidebar-overlay"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          "bt-sidebar",
          mobileOpen ? "bt-sidebar--mobile-open" : "",
          collapsed ? "bt-sidebar--collapsed" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label="Main navigation"
      >
        <div className="bt-sidebar-brand">
          <div className="bt-brand-mark" aria-hidden="true">
            <Bug size={22} />
          </div>

          {!collapsed && (
            <div className="bt-brand-copy">
              <span className="bt-brand-name">BugTrail</span>
              <span className="bt-brand-caption">Developer workspace</span>
            </div>
          )}

          <button
            type="button"
            className="bt-sidebar-mobile-close"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="bt-sidebar-nav">
          <p className="bt-sidebar-section-label">
            {collapsed ? "MAIN" : "WORKSPACE"}
          </p>

          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              title={collapsed ? label : undefined}
              end={path === "/dashboard"}
              onClick={onClose}
              className={({ isActive }) =>
                `bt-nav-item${isActive ? " active" : ""}`
              }
            >
              <Icon size={19} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}

          <p className="bt-sidebar-section-label bt-sidebar-section-spaced">
            {collapsed ? "TEAM" : "TEAM & PREFERENCES"}
          </p>

          {workspaceNavigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              title={collapsed ? label : undefined}
              onClick={onClose}
              className={({ isActive }) =>
                `bt-nav-item${isActive ? " active" : ""}`
              }
            >
              <Icon size={19} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {onToggleCollapse && (
          <button
            type="button"
            className="bt-sidebar-collapse"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight size={17} />
            ) : (
              <>
                <ChevronLeft size={17} />
                <span>Collapse sidebar</span>
              </>
            )}
          </button>
        )}

        <div className="bt-sidebar-footer">
          <span className="bt-sidebar-status-dot" />
          {!collapsed && (
            <span>
              <strong>BugTrail</strong>
              <small>Development workspace</small>
            </span>
          )}
        </div>
      </aside>
    </>
  );
}
