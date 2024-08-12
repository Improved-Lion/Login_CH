// src/api/client.ts
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const client = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

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
        const res = await client.post("/auth/refresh", { refreshToken });
        const { accessToken } = res.data;

        // 새 액세스 토큰을 sessionStorage에만 저장
        sessionStorage.setItem("token", accessToken);

        // authStore 업데이트
        useAuthStore.getState().setToken(accessToken);

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token 에러:", refreshError);

        // 토큰 제거 및 로그아웃
        sessionStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        useAuthStore.getState().logout();

        // 로그인 페이지로 리다이렉트
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default client;
