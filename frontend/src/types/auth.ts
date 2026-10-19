export type UserRole = "admin" | "developer" | "qa";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
