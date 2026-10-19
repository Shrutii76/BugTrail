import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? "";

      // Invalid credentials should remain on the login page.
      const isLoginOrRegister = /\/auth\/(login|register)(?:\?|$)/.test(url);

      const isLogout = /\/auth\/logout(?:\?|$)/.test(url);

      if (!isLoginOrRegister && !isLogout) {
        window.dispatchEvent(new Event("bugtrail:unauthorized"));
      }
    }

    return Promise.reject(error);
  },
);

export default api;
