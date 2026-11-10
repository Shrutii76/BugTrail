import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Types,
} from "mongoose";

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

export interface BugDocument {
  workspaceId: Types.ObjectId;
  title: string;
  description: string;
  status: BugStatus;
  severity: BugSeverity;
  priority: BugPriority;
  reporterId: Types.ObjectId;
  assigneeId?: Types.ObjectId | null;
  repositoryId?: Types.ObjectId | null;
  reproductionSteps: string[];
  expectedBehavior?: string;
  actualBehavior?: string;
  environment?: string;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const bugSchema = new Schema<BugDocument>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10_000,
    },
    status: {
      type: String,
      enum: BUG_STATUSES,
      default: "open",
      required: true,
    },
    severity: {
      type: String,
      enum: BUG_SEVERITIES,
      default: "medium",
      required: true,
    },
    priority: {
      type: String,
      enum: BUG_PRIORITIES,
      default: "medium",
      required: true,
    },
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assigneeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    repositoryId: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      default: null,
    },
    reproductionSteps: {
      type: [String],
      default: [],
    },
    expectedBehavior: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    actualBehavior: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    environment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Common workspace-scoped queries.
bugSchema.index({ workspaceId: 1, createdAt: -1 });
bugSchema.index({ workspaceId: 1, status: 1 });
bugSchema.index({ workspaceId: 1, severity: 1 });
bugSchema.index({ workspaceId: 1, assigneeId: 1 });
bugSchema.index({ workspaceId: 1, repositoryId: 1 });


// Workspace-scoped sorting
bugSchema.index({ workspaceId: 1, updatedAt: -1 });

// Workspace-scoped filters
bugSchema.index({ workspaceId: 1, status: 1, createdAt: -1 });
bugSchema.index({ workspaceId: 1, severity: 1, createdAt: -1 });
bugSchema.index({ workspaceId: 1, priority: 1, createdAt: -1 });
bugSchema.index({ workspaceId: 1, assigneeId: 1, createdAt: -1 });
bugSchema.index({ workspaceId: 1, repositoryId: 1, createdAt: -1 });

bugSchema.index(
  { title: "text", description: "text" },
  {
    weights: {
      title: 10,
      description: 3,
    },
    name: "bug_text_search",
  },
);

const Bug = models.Bug || model<BugDocument>("Bug", bugSchema);

export default Bug;
