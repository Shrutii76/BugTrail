import type { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import {
  clearAuthCookie,
  setAuthCookie,
  signAuthToken,
} from "../utils/auth.js";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../validators/authValidator.js";
import {
  hashPassword,
  verifyPassword,
} from "../services/passwordService.js";

function publicUser(user: InstanceType<typeof User>) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

export async function register(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const validation = validateRegisterInput(req.body);

    if (!validation.value) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: validation.error,
        },
      });
      return;
    }

    const { name, email, password } = validation.value;

    const existingUser = await User.findOne({ email }).lean();

    if (existingUser) {
      res.status(409).json({
        success: false,
        error: {
          code: "EMAIL_ALREADY_EXISTS",
          message: "An account with this email already exists.",
        },
      });
      return;
    }

    // Hash the password before storing it.
    const passwordHash = await hashPassword(password);

    // Never accept a role from the registration request.
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: "developer",
    });

    const token = signAuthToken(user.id);
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      data: {
        user: publicUser(user),
      },
    });
  } catch (error: unknown) {
    // Handles duplicate email registration races.
    if (
      error instanceof mongoose.mongo.MongoServerError &&
      error.code === 11000
    ) {
      res.status(409).json({
        success: false,
        error: {
          code: "EMAIL_ALREADY_EXISTS",
          message: "An account with this email already exists.",
        },
      });
      return;
    }

    console.error("Registration failed:", error);

    res.status(500).json({
      success: false,
      error: {
        code: "REGISTRATION_FAILED",
        message: "Unable to create your account.",
      },
    });
  }
}

export async function login(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const validation = validateLoginInput(req.body);

    if (!validation.value) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: validation.error,
        },
      });
      return;
    }

    const { email, password } = validation.value;

    // passwordHash is excluded by default in the User schema.
    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password.",
        },
      });
      return;
    }

    // Compare the submitted password against the stored hash.
    const passwordMatches = await verifyPassword(
      password,
      user.passwordHash,
    );

    if (!passwordMatches || !user.isActive) {
      res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password.",
        },
      });
      return;
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signAuthToken(user.id);
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      data: {
        user: publicUser(user),
      },
    });
  } catch (error: unknown) {
    console.error("Login failed:", error);

    res.status(500).json({
      success: false,
      error: {
        code: "LOGIN_FAILED",
        message: "Unable to log in right now.",
      },
    });
  }
}

export async function logout(
  _req: Request,
  res: Response,
): Promise<void> {
  clearAuthCookie(res);

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
}

export async function getCurrentUser(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const userId = res.locals.userId as string | undefined;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      res.status(401).json({
        success: false,
        error: {
          code: "INVALID_SESSION",
          message: "Please log in again.",
        },
      });
      return;
    }

    const user = await User.findById(userId);

    if (!user || !user.isActive) {
      clearAuthCookie(res);

      res.status(401).json({
        success: false,
        error: {
          code: "INVALID_SESSION",
          message: "Your account is unavailable. Please log in again.",
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: publicUser(user),
      },
    });
  } catch (error: unknown) {
    console.error("Fetching current user failed:", error);

    res.status(500).json({
      success: false,
      error: {
        code: "CURRENT_USER_FAILED",
        message: "Unable to retrieve your account.",
      },
    });
  }
}

