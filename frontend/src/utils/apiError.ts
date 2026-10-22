import axios from "axios";
import type { ApiErrorResponse } from "../types/api";

export class ApiError extends Error {
  status?: number;
  code?: string;
  details?: Record<string, string | string[]>;

  constructor(
    message: string,
    options?: {
      status?: number;
      code?: string;
      details?: Record<string, string | string[]>;
    },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = options?.status;
    this.code = options?.code;
    this.details = options?.details;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const response = error.response;
    const payload = response?.data;

    const message =
      payload?.message ??
      payload?.error ??
      (response
        ? `Request failed with status ${response.status}`
        : error.code === "ECONNABORTED"
          ? "The request timed out. Please try again."
          : "Unable to connect to the server. Check your connection.");

    return new ApiError(message, {
      status: response?.status,
      code: error.code,
      details: payload?.errors,
    });
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError("An unexpected error occurred.");
}
