import type { RequestHandler } from "express";
import type { UserRole } from "../types/user.types.js";

export function requireRole(...allowedRoles: UserRole[]): RequestHandler {
  return (_req, res, next) => {
    // requireAuth must run first and set the
    // authenticated user's role in res.locals.
    const role = res.locals.userRole as UserRole | undefined;

    if (!role) {
      res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHENTICATED",
          message: "Authentication required",
        },
      });
      return;
    }

    if (!allowedRoles.includes(role)) {
      res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action",
        },
      });
      return;
    }

    next();
  };
}
