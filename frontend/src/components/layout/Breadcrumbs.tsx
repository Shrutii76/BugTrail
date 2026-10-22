import { Fragment } from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  bugs: "Bugs",
  new: "Create Bug",
  timeline: "Timeline",
  repositories: "Repositories",
  analytics: "Analytics",
  team: "Team",
  notifications: "Notifications",
  settings: "Settings",
  profile: "Profile",
};

type BreadcrumbsProps = {
  currentLabel?: string;
};

export function Breadcrumbs({ currentLabel }: BreadcrumbsProps) {
  const location = useLocation();

  const segments = location.pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join("/")}`;

    let label =
      routeLabels[segment] ?? (segment === ":bugId" ? "Bug Details" : "");

    // Treat an unrecognized URL segment as a dynamic ID.
    if (!label) {
      label = segments[index - 1] === "bugs" ? "Bug Details" : "Details";
    }

    return { path, label, isLast: index === segments.length - 1 };
  });

  if (currentLabel && crumbs.length > 0) {
    crumbs[crumbs.length - 1].label = currentLabel;
  }

  return (
    <nav className="bt-breadcrumb" aria-label="Breadcrumb">
      <Link
        to="/dashboard"
        className="bt-breadcrumb-home"
        aria-label="Dashboard"
      >
        <Home size={15} />
      </Link>

      {crumbs.map((crumb) => (
        <Fragment key={crumb.path}>
          <ChevronRight
            size={14}
            className="bt-breadcrumb-separator"
            aria-hidden="true"
          />

          {crumb.isLast ? (
            <span className="bt-breadcrumb-current" aria-current="page">
              {crumb.label}
            </span>
          ) : (
            <Link to={crumb.path} className="bt-breadcrumb-link">
              {crumb.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
