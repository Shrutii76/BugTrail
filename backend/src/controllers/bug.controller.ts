import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import Bug from "../models/Bug";
import Label from "../models/Label";
import BugLabel from "../models/BugLabel";

import {
  createBugSchema,
  updateBugSchema,
  bugIdParamsSchema,
  listBugsQuerySchema,
} from "../validators/bug.validator";

import { ApiError } from "../utils/ApiError";

// Replace this with your existing authenticated request type if you have one.
interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role?: string;
  };
  workspaceId?: string;
}

function getAuthContext(req: AuthenticatedRequest) {
  const userId = req.user?._id;
  const workspaceId = req.workspaceId;

  if (!userId || !workspaceId) {
    throw new ApiError(
      401,
      "Authentication and workspace context are required",
    );
  }

  if (
    !mongoose.isValidObjectId(userId) ||
    !mongoose.isValidObjectId(workspaceId)
  ) {
    throw new ApiError(401, "Invalid authentication context");
  }

  return {
    userId: new mongoose.Types.ObjectId(userId),
    workspaceId: new mongoose.Types.ObjectId(workspaceId),
  };
}

function sendError(error: unknown, next: NextFunction) {
  next(error);
}

// POST /bugs
export async function createBug(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = createBugSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { userId, workspaceId } = getAuthContext(req);
    const input = parsed.data;

    // Validate that the referenced repository/assignee belongs
    // to this workspace before saving, if those fields are supplied.
    // Add these checks using your actual Repository and membership models.

    const bug = await Bug.create({
      ...input,
      dueDate: input.dueDate ? new Date(input.dueDate) : input.dueDate,
      workspaceId,
      reporterId: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Bug created successfully",
      data: { bug },
    });
  } catch (error) {
    return sendError(error, next);
  }
}

// GET /bugs
export async function getBugs(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = listBugsQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { workspaceId } = getAuthContext(req);
    const {
      status,
      severity,
      priority,
      assigneeId,
      repositoryId,
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    } = parsed.data;

    const filter: Record<string, unknown> = { workspaceId };

    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (priority) filter.priority = priority;

    if (assigneeId) {
      if (!mongoose.isValidObjectId(assigneeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid assignee ID",
        });
      }
      filter.assigneeId = new mongoose.Types.ObjectId(assigneeId);
    }

    if (repositoryId) {
      if (!mongoose.isValidObjectId(repositoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid repository ID",
        });
      }
      filter.repositoryId = new mongoose.Types.ObjectId(repositoryId);
    }

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const [bugs, total] = await Promise.all([
      Bug.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("reporterId", "name email")
        .populate("assigneeId", "name email")
        .populate("repositoryId", "name")
        .lean(),
      Bug.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Bugs retrieved successfully",
      data: {
        items: bugs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    return sendError(error, next);
  }
}

// GET /bugs/:bugId
export async function getBugById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = bugIdParamsSchema.safeParse(req.params);

    if (!params.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid bug ID",
      });
    }

    const { workspaceId } = getAuthContext(req);

    const bug = await Bug.findOne({
      _id: params.data.bugId,
      workspaceId,
    })
      .populate("reporterId", "name email")
      .populate("assigneeId", "name email")
      .populate("repositoryId", "name")
      .lean();

    if (!bug) {
      return res.status(404).json({
        success: false,
        message: "Bug not found",
      });
    }

    const labels = await BugLabel.find({
      workspaceId,
      bugId: bug._id,
    })
      .populate({
        path: "labelId",
        model: Label,
        select: "name color description",
      })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Bug retrieved successfully",
      data: {
        bug,
        labels: labels.map((item) => item.labelId).filter(Boolean),
      },
    });
  } catch (error) {
    return sendError(error, next);
  }
}

// PATCH /bugs/:bugId
export async function updateBug(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = bugIdParamsSchema.safeParse(req.params);
    const parsed = updateBugSchema.safeParse(req.body);

    if (!params.success || !parsed.success) {
      const issues = [
        ...(params.success ? [] : params.error.issues),
        ...(parsed.success ? [] : parsed.error.issues),
      ];

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { workspaceId } = getAuthContext(req);
    const updates = { ...parsed.data };

    const bug = await Bug.findOneAndUpdate(
      {
        _id: params.data.bugId,
        workspaceId,
      },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("reporterId", "name email")
      .populate("assigneeId", "name email")
      .populate("repositoryId", "name");

    if (!bug) {
      return res.status(404).json({
        success: false,
        message: "Bug not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bug updated successfully",
      data: { bug },
    });
  } catch (error) {
    return sendError(error, next);
  }
}
