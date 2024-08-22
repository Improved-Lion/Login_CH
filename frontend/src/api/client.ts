import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
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
    if (error.response) {
      // 서버가 2xx 범위를 벗어나는 상태 코드로 응답한 경우
      console.error(
        "Server responded with an error:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.error("No response received:", error.request);
    } else {
      // 요청 설정 중에 오류가 발생한 경우
      console.error("Error setting up the request:", error.message);
    }

    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        if (import.meta.env.DEV) {
          console.log("Attempting to refresh token...");
        }

        const res = await client.post("/auth/refresh", { refreshToken });
        const { accessToken } = res.data;

        if (import.meta.env.DEV) {
          console.log("Token refreshed successfully");
        }

        sessionStorage.setItem("token", accessToken);
        useAuthStore.getState().setToken(accessToken);

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token error:", refreshError);
        useAuthStore.getState().logout();
        window.location.href = "/login"; // 로그인 페이지로 리다이렉트
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default client;
