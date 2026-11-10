import type { RequestHandler } from "express";
import type { ZodType } from "zod";

type ValidationTarget = "body" | "params" | "query";

export function validate(
  schema: ZodType,
  target: ValidationTarget = "body",
): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    if (target === "body") {
      req.body = result.data;
    } else if (target === "params") {
      req.params = result.data as typeof req.params;
    } else {
      // Express query objects may be read-only in some versions.
      // Use the parsed result directly in your controller instead.
      res.locals.validatedQuery = result.data;
    }

    next();
  };
}
