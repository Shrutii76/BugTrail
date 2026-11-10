import { z } from "zod";
import {
  BUG_PRIORITIES,
  BUG_SEVERITIES,
  BUG_STATUSES,
} from "../constants/bug.constants";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

const optionalObjectIdSchema = objectIdSchema.nullable().optional();

const optionalTextSchema = (maxLength: number) =>
  z.string().trim().max(maxLength).optional();

export const createBugSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must contain at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must contain at least 10 characters")
    .max(10000, "Description cannot exceed 10000 characters"),

  status: z.enum(BUG_STATUSES).optional(),
  severity: z.enum(BUG_SEVERITIES).optional(),
  priority: z.enum(BUG_PRIORITIES).optional(),

  assigneeId: optionalObjectIdSchema,
  repositoryId: optionalObjectIdSchema,

  reproductionSteps: z
    .array(z.string().trim().min(1).max(2000))
    .max(30)
    .optional(),

  expectedBehavior: optionalTextSchema(5000),
  actualBehavior: optionalTextSchema(5000),
  environment: optionalTextSchema(1000),

  dueDate: z.string().datetime({ offset: true }).nullable().optional(),
});

export const updateBugSchema = createBugSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "Provide at least one field to update",
  );

export const bugIdParamsSchema = z.object({
  bugId: objectIdSchema,
});

export const listBugsQuerySchema = z.object({
  status: z.enum(BUG_STATUSES).optional(),
  severity: z.enum(BUG_SEVERITIES).optional(),
  priority: z.enum(BUG_PRIORITIES).optional(),

  assigneeId: objectIdSchema.optional(),
  repositoryId: objectIdSchema.optional(),

  search: z.string().trim().max(200).optional(),

  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),

  sortBy: z
    .enum(["createdAt", "updatedAt", "title", "priority", "severity"])
    .default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateBugInput = z.infer<typeof createBugSchema>;
export type UpdateBugInput = z.infer<typeof updateBugSchema>;
export type BugIdParams = z.infer<typeof bugIdParamsSchema>;
export type ListBugsQuery = z.infer<typeof listBugsQuerySchema>;
