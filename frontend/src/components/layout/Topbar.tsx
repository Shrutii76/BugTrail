import { Bell, LogOut, Menu, Search, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Dropdown, type DropdownItem } from "../ui";
import { Breadcrumbs } from "./Breadcrumbs";

type TopbarProps = {
  onMenuClick: () => void;
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
};

export function Topbar({
  onMenuClick,
  userName = "Developer",
  userEmail = "",
  onLogout,
}: TopbarProps) {
  const navigate = useNavigate();

  const userMenuItems: DropdownItem[] = [
    {
      label: "My Profile",
      icon: <UserRound size={16} />,
      onClick: () => navigate("/profile"),
    },
    {
      label: "Settings",
      onClick: () => navigate("/settings"),
    },
    {
      label: "Log out",
      icon: <LogOut size={16} />,
      danger: true,
      onClick: () => {
        onLogout?.();
      },
    },
  ];

  return (
    <header className="bt-topbar">
      <div className="bt-topbar-left">
        <button
          type="button"
          className="bt-mobile-menu-button"
          aria-label="Open navigation"
          onClick={onMenuClick}
        >
          <Menu size={21} />
        </button>

        <Breadcrumbs />
      </div>

      <div className="bt-topbar-actions">
        <button
          type="button"
          className="bt-topbar-icon-button"
          aria-label="Search bugs"
          onClick={() => navigate("/bugs")}
        >
          <Search size={19} />
        </button>

        <Link
          to="/notifications"
          className="bt-topbar-icon-button"
          aria-label="Notifications"
        >
          <Bell size={19} />
        </Link>

        <div className="bt-topbar-divider" />

        <Dropdown
          label={userName}
          align="right"
          items={userMenuItems}
          trigger={
            <span className="bt-user-trigger">
              <Avatar name={userName} size="sm" />
              <span className="bt-user-copy">
                <strong>{userName}</strong>
                {userEmail && <small>{userEmail}</small>}
              </span>
            </span>
          }
        />
      </div>
    </header>
  );
}
