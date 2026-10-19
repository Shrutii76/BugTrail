import jwt from "jsonwebtoken";
import type { CookieOptions, Response } from "express";

const COOKIE_NAME = "bugtrail_token";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be configured with a strong secret");
  }

  return secret;
}

function getExpiresInSeconds(): number {
  const value = process.env.JWT_EXPIRES_IN || "1d";
  const match = value.match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error("JWT_EXPIRES_IN must use a value like 15m, 1h, or 1d");
  }

  const amount = Number(match[1]);
  const unit = match[2];

  const multiplier: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };

  return amount * multiplier[unit];
}

export function signAuthToken(userId: string): string {
  const expiresIn = getExpiresInSeconds();

  return jwt.sign({ sub: userId }, getJwtSecret(), { expiresIn });
}

export function verifyAuthToken(token: string): string {
  const payload = jwt.verify(token, getJwtSecret());

  if (typeof payload === "string" || typeof payload.sub !== "string") {
    throw new Error("Invalid authentication token");
  }

  return payload.sub;
}

export const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    ...authCookieOptions,
    maxAge: getExpiresInSeconds() * 1000,
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, authCookieOptions);
}

export { COOKIE_NAME };
