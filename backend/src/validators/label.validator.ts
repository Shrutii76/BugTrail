import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createLabelSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Label name is required")
    .max(50, "Label name cannot exceed 50 characters"),

  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color, e.g. #6366f1")
    .optional(),

  description: z.string().trim().max(300).optional(),
});

export const updateLabelSchema = createLabelSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "Provide at least one field to update",
  );

export const labelIdParamsSchema = z.object({
  labelId: objectIdSchema,
});

export const bugLabelParamsSchema = z.object({
  bugId: objectIdSchema,
  labelId: objectIdSchema,
});

export type CreateLabelInput = z.infer<typeof createLabelSchema>;
export type UpdateLabelInput = z.infer<typeof updateLabelSchema>;
