import { Bug, GitBranch, Plus, Activity } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-background font-sans text-text-main">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-border bg-sidebar p-6 md:block">
        <div className="mb-10 flex items-center gap-3">
          <div className="rounded-lg bg-primary p-2">
            <Bug size={22} />
          </div>
          <span className="text-xl font-bold">BugTrail</span>
        </div>

        <nav className="space-y-2">
          <a className="flex items-center gap-3 rounded-lg bg-primary/15 px-4 py-3 text-primary-hover">
            <Activity size={18} />
            Overview
          </a>
          <a className="flex items-center gap-3 rounded-lg px-4 py-3 text-text-secondary hover:bg-elevated">
            <Bug size={18} />
            Bugs
          </a>
          <a className="flex items-center gap-3 rounded-lg px-4 py-3 text-text-secondary hover:bg-elevated">
            <GitBranch size={18} />
            Timeline
          </a>
        </nav>
      </aside>

      <main className="p-6 md:ml-60 md:p-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm text-text-muted">Workspace / Overview</p>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-2 text-text-secondary">
              Track bugs and reconstruct how they happened.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium hover:bg-primary-hover">
            <Plus size={18} />
            Create Bug
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Open Bugs", "128", "text-info"],
            ["Critical Bugs", "12", "text-danger"],
            ["In Progress", "34", "text-warning"],
            ["Resolved", "86", "text-success"],
          ].map(([label, value, color]) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <p className="text-sm text-text-muted">{label}</p>
              <p className={`mt-3 text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">Recent Bug Activity</h2>
          <div className="mt-6 flex items-start gap-4">
            <div className="rounded-lg bg-accent/10 p-3 text-accent">
              <GitBranch size={20} />
            </div>
            <div>
              <p className="font-medium">Pull request merged</p>
              <p className="mt-1 text-sm text-text-muted">
                Coupon validation fix · 20 minutes ago
              </p>
            </div>
            <span className="ml-auto rounded-full bg-success/10 px-3 py-1 text-xs text-success">
              Merged
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
