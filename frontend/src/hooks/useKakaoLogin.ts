import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import client from "@/api/client";

const useKakaoLogin = () => {
  const [isKakaoInitialized, setIsKakaoInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(import.meta.env.VITE_KAKAO_APP_KEY);
        setIsKakaoInitialized(true);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleKakaoCallback = useCallback(
    async (code: string) => {
      if (isProcessing) return;
      setIsProcessing(true);
      try {
        const state = Math.random().toString(36).substr(2, 11);
        const response = await client.post("/auth/kakao", { code, state });
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
      } catch (error: any) {
        console.error("Kakao login error:", error);
        alert(
          error.response?.data?.message ||
            "카카오 로그인 중 오류가 발생했습니다."
        );
        navigate("/login", { replace: true });
      } finally {
        setIsProcessing(false);
      }
    },
    [navigate, setToken, setUser, isProcessing]
  );

  const handleKakaoLogin = useCallback(() => {
    if (!isKakaoInitialized) {
      console.error("Kakao SDK is not initialized yet");
      alert("카카오 로그인을 준비 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    if (window.Kakao && window.Kakao.Auth) {
      window.Kakao.Auth.authorize({
        redirectUri: `${window.location.origin}/login/kakao/callback`,
        scope: "profile_nickname,profile_image,account_email",
      });
    } else {
      console.error("Kakao SDK is not loaded properly");
      alert(
        "카카오 로그인을 불러오는 데 실패했습니다. 페이지를 새로고침 후 다시 시도해주세요."
      );
    }
  }, [isKakaoInitialized]);

  return { handleKakaoLogin, handleKakaoCallback, isKakaoInitialized };
};

export default useKakaoLogin;
