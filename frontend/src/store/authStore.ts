// src/store/authStore.ts
import { create } from "zustand";
import client from "@/api/client";

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token") || sessionStorage.getItem("token"),
  setToken: (token: string) => {
    set({ token });
    // 토큰을 localStorage 또는 sessionStorage에 저장
    if (localStorage.getItem("rememberMe") === "true") {
      localStorage.setItem("token", token);
    } else {
      sessionStorage.setItem("token", token);
    }
  },
  clearToken: async () => {
    try {
      // 서버에 로그아웃 요청
      await client.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // 로컬 스토리지와 세션 스토리지에서 토큰 제거
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      // 상태에서 토큰 제거
      set({ token: null });
    }
  },
}));
