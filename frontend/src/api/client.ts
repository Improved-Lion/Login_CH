import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const client = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

client.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        console.log("Attempting to refresh token...");
        const res = await client.post("/auth/refresh", { refreshToken });
        const { accessToken } = res.data;

        console.log("Token refreshed successfully");
        sessionStorage.setItem("token", accessToken);
        useAuthStore.getState().setToken(accessToken);

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token error:", refreshError);
        useAuthStore.getState().logout();

        // 로그아웃 후 홈페이지로 리다이렉트
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default client;
