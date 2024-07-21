import { create } from "zustand";

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: sessionStorage.getItem("token"),
  setToken: (token) => {
    set({ token });
    if (token) {
      sessionStorage.setItem("token", token);
    } else {
      sessionStorage.removeItem("token");
    }
  },
}));
