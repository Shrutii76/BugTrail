export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success?: false;
  message?: string;
  error?: string;
  errors?: Record<string, string | string[]>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedData<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type ApiResult<T> = ApiResponse<T>;
