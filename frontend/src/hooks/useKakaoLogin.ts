import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import client from "@/api/client";
import axios from "axios";

const useKakaoLogin = () => {
  const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY ?? "";
  const KAKAO_REDIRECT_URI = import.meta.env.VITE_REDIRECT_URL ?? "";

  const [isLoading, setIsLoading] = useState(false);
  const [isKakaoInitialized, setIsKakaoInitialized] = useState(false);
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  useEffect(() => {
    const loadKakaoSDK = () => {
      const script = document.createElement("script");
      script.src = "https://developers.kakao.com/sdk/js/kakao.js";
      script.async = true;
      script.onload = () => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
          window.Kakao.init(KAKAO_APP_KEY);
          setIsKakaoInitialized(true);
        }
      };
      document.body.appendChild(script);
    };

    if (!window.Kakao) {
      loadKakaoSDK();
    } else if (!window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_APP_KEY);
      setIsKakaoInitialized(true);
    } else {
      setIsKakaoInitialized(true);
    }
  }, [KAKAO_APP_KEY]);

  const handleKakaoCallback = useCallback(
    async (code: string) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const response = await client.post("/auth/kakao", { code });
        if (response.data.ok === 1 && response.data.item) {
          const { token, ...userInfo } = response.data.item;
          sessionStorage.setItem("token", token.accessToken);
          localStorage.setItem("refreshToken", token.refreshToken);
          setToken(token.accessToken);
          setUser(userInfo);
          navigate("/", { replace: true });
        } else {
          throw new Error(response.data.message || "Login failed");
        }
      } catch (error) {
        console.error("Kakao login error:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            console.log("카카오 로그인 오류:", error.response.data);
            alert("카카오 로그인 중 오류가 발생했습니다. 다시 시도해 주세요.");
            // 로그인 페이지로 리다이렉트
            navigate("/login", { replace: true });
          } else if (error.response?.status === 500) {
            console.log("서버 오류:", error.response.data);
            alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
          } else {
            alert("로그인에 실패했습니다. 다시 시도해주세요.");
          }
        } else {
          alert("알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, setToken, setUser, isLoading]
  );

  const handleKakaoLogin = useCallback(() => {
    if (!isLoading && isKakaoInitialized && window.Kakao && window.Kakao.Auth) {
      window.Kakao.Auth.authorize({
        redirectUri: KAKAO_REDIRECT_URI,
        scope: "profile_nickname, profile_image, account_email",
      });
    } else if (!isKakaoInitialized) {
      console.error("Kakao SDK is not initialized yet");
    } else {
      console.error("Kakao SDK is not loaded or initialized");
    }
  }, [isLoading, isKakaoInitialized, KAKAO_REDIRECT_URI]);

  return {
    handleKakaoLogin,
    handleKakaoCallback,
    isLoading,
    isKakaoInitialized,
  };
};

export default useKakaoLogin;
