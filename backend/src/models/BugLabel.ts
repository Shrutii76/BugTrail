import { Schema, model, models, type Types } from "mongoose";

export interface BugLabelDocument {
  workspaceId: Types.ObjectId;
  bugId: Types.ObjectId;
  labelId: Types.ObjectId;
  addedBy: Types.ObjectId;
  createdAt: Date;
}

const bugLabelSchema = new Schema<BugLabelDocument>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    bugId: {
      type: Schema.Types.ObjectId,
      ref: "Bug",
      required: true,
    },
    labelId: {
      type: Schema.Types.ObjectId,
      ref: "Label",
      required: true,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

// A label can be attached only once to a bug in a workspace.
bugLabelSchema.index(
  { workspaceId: 1, bugId: 1, labelId: 1 },
  { unique: true },
);

bugLabelSchema.index({ workspaceId: 1, bugId: 1 });
bugLabelSchema.index({ workspaceId: 1, labelId: 1 });

const BugLabel =
  models.BugLabel || model<BugLabelDocument>("BugLabel", bugLabelSchema);

export default BugLabel;
