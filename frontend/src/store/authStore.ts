// src/store/authStore.ts
import { create } from "zustand";
import client from "@/api/client";

export interface User {
  id?: number;
  email: string;
  username: string;
  password: string;
  full_name?: string;
  profile_image_url?: string;
  provider?: string;
  provider_id?: string;
  access_token?: string;
  type?: string;
  login_type?: string;
  phone?: string;
  address?: string;
  created_at?: Date;
  updated_at?: Date;
  verification_code?: string;
  verification_code_expires?: Date;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isInitialized: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  clearToken: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token") || sessionStorage.getItem("token"),
  user: null,
  isInitialized: false,
  setToken: (token: string) => {
    set({ token });
    if (localStorage.getItem("rememberMe") === "true") {
      localStorage.setItem("token", token);
    } else {
      sessionStorage.setItem("token", token);
    }
  },
  setUser: (user: User) => set({ user }),
  clearToken: async () => {
    try {
      await client.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      set({ token: null, user: null });
    }
  },
  initialize: async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try {
        const response = await client.get("/users/me");
        set({ user: response.data, isInitialized: true });
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        set({ token: null, user: null, isInitialized: true });
      }
    } else {
      set({ isInitialized: true });
    }
  },
}));
