import { create } from "zustand";
import client from "@/api/client";
import { persist } from "zustand/middleware";

export interface User {
  id?: number;
  email: string;
  username: string;
  full_name?: string;
  profile_image_url?: string;
  provider?: string;
  provider_id?: string;
  type?: string;
  login_type?: string;
  phone?: string;
  address?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  clearToken: () => void; // clearToken 함수 추가
  initialize: () => Promise<void>;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      setUser: (user) => set({ user }),
      login: (accessToken, refreshToken, user) => {
        sessionStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        set({ token: accessToken, user, isAuthenticated: true });
      },
      logout: () => {
        sessionStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        set({ token: null, user: null, isAuthenticated: false });
      },
      clearToken: () => {
        // clearToken 함수 구현
        set({ token: null, isAuthenticated: false });
        sessionStorage.removeItem("token");
      },
      initialize: async () => {
        set({ isLoading: true });
        const accessToken = sessionStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");
        if (accessToken) {
          try {
            const response = await client.get("/users/me");
            set({
              token: accessToken,
              user: response.data,
              isAuthenticated: true,
            });
          } catch (error) {
            console.error("Failed to fetch user data:", error);
            if (refreshToken) {
              try {
                const refreshResponse = await client.post("/auth/refresh", {
                  refreshToken,
                });
                const newAccessToken = refreshResponse.data.accessToken;
                sessionStorage.setItem("token", newAccessToken);
                const userResponse = await client.get("/users/me");
                set({
                  token: newAccessToken,
                  user: userResponse.data,
                  isAuthenticated: true,
                });
              } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                get().logout();
              }
            } else {
              get().logout();
            }
          }
        }
        set({ isLoading: false });
      },
    }),
    {
      name: "auth",
      getStorage: () => localStorage,
    }
  )
);
