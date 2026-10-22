import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <section className="bt-ui-empty-state" aria-label={title}>
      {icon && (
        <div className="bt-ui-empty-icon" aria-hidden="true">
          {icon}
        </div>
      )}

      <h3 className="bt-ui-empty-title">{title}</h3>

      {description && <p className="bt-ui-empty-description">{description}</p>}

      {action && <div className="bt-ui-empty-action">{action}</div>}
    </section>
  );
}
