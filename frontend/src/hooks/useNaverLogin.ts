import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import client from "@/api/client";
import { useCallback } from "react";

const useNaverLogin = () => {
  const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID ?? "";
  const NAVER_REDIRECT_URI = import.meta.env.VITE_REDIRECT_URL ?? "";
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  const handleNaverLogin = () => {
    const state = Math.random().toString(36).substr(2, 11);
    localStorage.setItem("naverState", state);
    const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${state}&redirect_uri=${encodeURIComponent(
      NAVER_REDIRECT_URI
    )}`;
    window.location.href = NAVER_AUTH_URL;
  };

  const handleNaverCallback = useCallback(
    async (code: string, state: string) => {
      const storedState = localStorage.getItem("naverState");

      if (state !== storedState) {
        console.error("State mismatch. Possible CSRF attack.");
        alert("보안 오류가 발생했습니다. 다시 로그인해 주세요.");
        localStorage.removeItem("naverState");
        return;
      }

      try {
        const response = await client.post("/auth/naver", { code, state });
        if (response.data.ok === 1 && response.data.item) {
          const { token, ...userInfo } = response.data.item;
          sessionStorage.setItem("token", token.accessToken);
          localStorage.setItem("refreshToken", token.refreshToken);
          setToken(token.accessToken);
          setUser(userInfo);
          navigate("/");
        } else {
          throw new Error(response.data.message || "Login failed");
        }
      } catch (error) {
        console.error("Naver login error:", error);
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
      } finally {
        localStorage.removeItem("naverState");
      }
    },
    [navigate, setToken, setUser]
  );

  return { handleNaverLogin, handleNaverCallback };
};

export default useNaverLogin;
