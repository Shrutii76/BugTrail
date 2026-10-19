import type { Request, Response, NextFunction } from "express";
import { COOKIE_NAME, verifyAuthToken } from "../utils/auth.js";

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token || typeof token !== "string") {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHENTICATED",
        message: "Please log in to continue.",
      },
    });
    return;
  }

  try {
    res.locals.userId = verifyAuthToken(token);
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: {
        code: "INVALID_TOKEN",
        message: "Your session is invalid or expired. Please log in again.",
      },
    });
  }
}
