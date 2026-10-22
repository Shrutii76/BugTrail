import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen || window.innerWidth > 700) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  async function handleLogout() {
    try {
      await logout();
    } finally {
      setMobileOpen(false);
    }
  }

  return (
    <div
      className={["bt-dashboard", collapsed ? "bt-dashboard--collapsed" : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((previous) => !previous)}
      />

      <div className="bt-main">
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
          userName={user?.name ?? "Developer"}
          onLogout={handleLogout}
        />

        <main className="bt-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
