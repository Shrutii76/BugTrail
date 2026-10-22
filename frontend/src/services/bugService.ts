import api from "./api";
import type {
  ApiResponse,
  PaginatedData,
  PaginationParams,
} from "../types/api";

export type BugStatus =
  | "open"
  | "in-progress"
  | "in-review"
  | "resolved"
  | "closed";

export type BugSeverity = "low" | "medium" | "high" | "critical";

export interface Bug {
  _id: string;
  title: string;
  description: string;
  status: BugStatus;
  severity: BugSeverity;
  repository?: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBugInput {
  title: string;
  description: string;
  severity: BugSeverity;
  repository?: string;
  assignee?: string;
}

export const bugService = {
  async getAll(params: PaginationParams = {}) {
    const response = await api.get<ApiResponse<PaginatedData<Bug>>>("/bugs", {
      params,
    });

    return response.data.data;
  },

  async getById(bugId: string) {
    const response = await api.get<ApiResponse<Bug>>(
      `/bugs/${encodeURIComponent(bugId)}`,
    );

    return response.data.data;
  },

  async create(input: CreateBugInput) {
    const response = await api.post<ApiResponse<Bug>>("/bugs", input);

    return response.data.data;
  },
};
