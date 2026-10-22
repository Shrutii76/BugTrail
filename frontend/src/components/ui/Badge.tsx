import type { HTMLAttributes } from "react";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

export function Badge({
  variant = "default",
  dot = false,
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={`bt-ui-badge bt-ui-badge--${variant} ${className}`.trim()}
    >
      {dot && <span className="bt-ui-badge-dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
