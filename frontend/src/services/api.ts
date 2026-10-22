import axios from "axios";
import { normalizeApiError } from "../utils/apiError";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api",
  withCredentials: true,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const url = error.config?.url ?? "";

      // Match auth endpoints without depending on the API prefix.
      const isLoginOrRegister = /\/auth\/(login|register)(?:[/?#]|$)/i.test(
        url,
      );

      const isLogout = /\/auth\/logout(?:[/?#]|$)/i.test(url);

      // Let AuthContext clear the local session for unauthorized
      // protected requests, but not for invalid login credentials.
      if (
        status === 401 &&
        !isLoginOrRegister &&
        !isLogout &&
        typeof window !== "undefined"
      ) {
        window.dispatchEvent(new Event("bugtrail:unauthorized"));
      }
    }

    return Promise.reject(normalizeApiError(error));
  },
);

export default api;
