import { Schema, model, models, type Types } from "mongoose";

export interface LabelDocument {
  workspaceId: Types.ObjectId;
  name: string;
  color: string;
  description?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const labelSchema = new Schema<LabelDocument>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    color: {
      type: String,
      default: "#6366f1",
      match: /^#[0-9A-Fa-f]{6}$/,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Prevent duplicate names inside one workspace.
labelSchema.index({ workspaceId: 1, name: 1 }, { unique: true });

const Label = models.Label || model<LabelDocument>("Label", labelSchema);

export default Label;
