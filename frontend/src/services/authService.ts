import api from "./api";
import type { AuthResponse, User } from "../types/auth";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<User> {
    const response = await api.post<AuthResponse>("/auth/register", payload);

    return response.data.data.user;
  },

  async login(payload: LoginPayload): Promise<User> {
    const response = await api.post<AuthResponse>("/auth/login", payload);

    return response.data.data.user;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<AuthResponse>("/auth/me");

    return response.data.data.user;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};
