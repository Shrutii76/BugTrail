import {
  Bug,
  GitPullRequest,
  Clock3,
  CheckCircle2,
  Plus,
  Activity,
  GitBranch,
  ArrowUpRight,
  CircleDot,
  AlertTriangle,
  CircleCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const metrics = [
  {
    title: "Total Bugs",
    value: "128",
    change: "+12 this week",
    icon: Bug,
    color: "#818cf8",
  },
  {
    title: "Open Issues",
    value: "36",
    change: "8 high priority",
    icon: CircleDot,
    color: "#f59e0b",
  },
  {
    title: "Resolved",
    value: "84",
    change: "+18 this month",
    icon: CheckCircle2,
    color: "#22c55e",
  },
  {
    title: "Avg. Resolution",
    value: "4.2 days",
    change: "12% faster",
    icon: Clock3,
    color: "#22d3ee",
  },
];

const recentBugs = [
  {
    id: "BUG-128",
    title: "Login fails after session expires",
    repository: "bugtrail/frontend",
    status: "In Progress",
    severity: "Critical",
    assignee: "ST",
    color: "#ef4444",
    time: "12 min ago",
  },
  {
    id: "BUG-127",
    title: "Dashboard metrics show stale data",
    repository: "bugtrail/backend",
    status: "Open",
    severity: "High",
    assignee: "AK",
    color: "#f59e0b",
    time: "38 min ago",
  },
  {
    id: "BUG-126",
    title: "Repository sync returns duplicate commits",
    repository: "bugtrail/integrations",
    status: "In Review",
    severity: "Medium",
    assignee: "RS",
    color: "#38bdf8",
    time: "1 hour ago",
  },
  {
    id: "BUG-125",
    title: "Comment editor loses formatting",
    repository: "bugtrail/frontend",
    status: "Resolved",
    severity: "Low",
    assignee: "PM",
    color: "#22c55e",
    time: "3 hours ago",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.name?.split(" ")[0] ?? "Developer";

  return (
    <>
      <section className="bt-welcome">
        <div>
          <div className="bt-eyebrow">
            <span className="bt-live-dot" />
            YOUR ENGINEERING WORKSPACE
          </div>

          <h1>
            Good to see you, {firstName}
            <span> 👋</span>
          </h1>

          <p>Here's what's happening across your bugs and repositories.</p>
        </div>

        <button
          type="button"
          className="bt-primary-button"
          onClick={() => navigate("/bugs/new")}
        >
          <Plus size={18} />
          Report a bug
        </button>
      </section>

      <section className="bt-metrics">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article className="bt-metric-card" key={metric.title}>
              <div className="bt-metric-top">
                <span>{metric.title}</span>

                <span
                  className="bt-metric-icon"
                  style={{ color: metric.color }}
                >
                  <Icon size={19} />
                </span>
              </div>

              <div className="bt-metric-value">{metric.value}</div>

              <div className="bt-metric-change">
                <ArrowUpRight size={15} />
                {metric.change}
              </div>
            </article>
          );
        })}
      </section>

      <section className="bt-dashboard-grid">
        <article className="bt-panel bt-bugs-panel">
          <div className="bt-panel-heading">
            <div>
              <h2>Recent bugs</h2>
              <p>Latest activity across your workspace</p>
            </div>

            <Link to="/bugs" className="bt-text-link">
              View all <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="bt-bug-list">
            {recentBugs.map((bug) => (
              <Link to={`/bugs/${bug.id}`} className="bt-bug-row" key={bug.id}>
                <div
                  className="bt-bug-severity"
                  style={{ background: bug.color }}
                />

                <div className="bt-bug-details">
                  <div className="bt-bug-title-row">
                    <span className="bt-bug-id">{bug.id}</span>
                    <strong>{bug.title}</strong>
                  </div>

                  <div className="bt-bug-meta">
                    <span>{bug.repository}</span>
                    <span>·</span>
                    <span>{bug.time}</span>
                  </div>
                </div>

                <span
                  className={`bt-status status-${bug.status
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {bug.status}
                </span>

                <span className="bt-severity-label">{bug.severity}</span>

                <span className="bt-assignee">{bug.assignee}</span>
              </Link>
            ))}
          </div>
        </article>

        <article className="bt-panel bt-activity-panel">
          <div className="bt-panel-heading">
            <div>
              <h2>Bug health</h2>
              <p>Current issue distribution</p>
            </div>

            <Activity size={18} color="#818cf8" />
          </div>

          <div className="bt-health-total">
            <strong>128</strong>
            <span>Total tracked bugs</span>
          </div>

          <div
            className="bt-health-bar"
            role="img"
            aria-label="84 resolved, 36 open or active, 8 critical bugs"
          >
            <span style={{ width: "66%", background: "#22c55e" }} />
            <span style={{ width: "28%", background: "#f59e0b" }} />
            <span style={{ width: "6%", background: "#ef4444" }} />
          </div>

          <div className="bt-health-legend">
            <div>
              <span className="legend-dot green" />
              <span>Resolved</span>
              <strong>84</strong>
            </div>

            <div>
              <span className="legend-dot amber" />
              <span>Open / Active</span>
              <strong>36</strong>
            </div>

            <div>
              <span className="legend-dot red" />
              <span>Critical</span>
              <strong>8</strong>
            </div>
          </div>

          <div className="bt-insight">
            <span className="bt-insight-icon">
              <GitPullRequest size={17} />
            </span>

            <div>
              <strong>Keep the momentum</strong>
              <p>Connect GitHub to link fixes to commits and pull requests.</p>
            </div>
          </div>
        </article>
      </section>

      <section className="bt-bottom-grid">
        <article className="bt-panel bt-quick-panel">
          <div className="bt-panel-heading">
            <div>
              <h2>Quick actions</h2>
              <p>Jump back into your workflow</p>
            </div>
          </div>

          <div className="bt-quick-actions">
            <button type="button" onClick={() => navigate("/bugs/new")}>
              <Plus size={18} />
              <span>Report a bug</span>
              <ArrowUpRight size={15} />
            </button>

            <button type="button" onClick={() => navigate("/timeline")}>
              <Activity size={18} />
              <span>Explore timelines</span>
              <ArrowUpRight size={15} />
            </button>

            <button type="button" onClick={() => navigate("/repositories")}>
              <GitBranch size={18} />
              <span>Connect repository</span>
              <ArrowUpRight size={15} />
            </button>
          </div>
        </article>

        <article className="bt-panel bt-tip-panel">
          <div className="bt-tip-icon">
            <AlertTriangle size={20} />
          </div>

          <div>
            <h2>Make every bug traceable</h2>
            <p>
              Add clear reproduction steps and link code changes so your team
              can understand how each issue happened.
            </p>

            <Link to="/bugs/new" className="bt-text-link">
              Create your first bug <ArrowUpRight size={15} />
            </Link>
          </div>
        </article>
      </section>

      <footer className="bt-dashboard-footer">
        <span>BugTrail · Developer workspace</span>

        <span>
          <CircleCheck size={14} />
          All systems operational
        </span>
      </footer>
    </>
  );
}
