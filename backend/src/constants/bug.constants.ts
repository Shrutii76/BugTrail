export const BUG_STATUSES = [
  "open",
  "in-progress",
  "in-review",
  "resolved",
  "closed",
] as const;

export const BUG_SEVERITIES = ["low", "medium", "high", "critical"] as const;

export const BUG_PRIORITIES = ["low", "medium", "high", "urgent"] as const;

export type BugStatus = (typeof BUG_STATUSES)[number];
export type BugSeverity = (typeof BUG_SEVERITIES)[number];
export type BugPriority = (typeof BUG_PRIORITIES)[number];
