import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import client from "@/api/client";

const useKakaoLogin = () => {
  const KAKAO_APP_KEY = process.env.VITE_KAKAO_APP_KEY ?? "";
  const KAKAO_REDIRECT_URI = process.env.VITE_REDIRECT_URL ?? "";
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();
  const [isKakaoSDKLoaded, setIsKakaoSDKLoaded] = useState(false);

  useEffect(() => {
    const loadKakaoSDK = () => {
      return new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.src = "https://developers.kakao.com/sdk/js/kakao.js";
        script.async = true;
        script.onload = () => {
          window.Kakao.init(KAKAO_APP_KEY);
          setIsKakaoSDKLoaded(true);
          resolve();
        };
        document.body.appendChild(script);
      });
    };

    if (typeof window.Kakao === "undefined") {
      loadKakaoSDK();
    } else if (!window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_APP_KEY);
      setIsKakaoSDKLoaded(true);
    }
  }, [KAKAO_APP_KEY]);

  useEffect(() => {
    const handleKakaoCallback = async (code: string) => {
      try {
        const response = await client.post("/auth/kakao", { code });
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
        console.error("Kakao login error:", error);
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      handleKakaoCallback(code);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [navigate, setToken, setUser]);

  const handleKakaoLogin = () => {
    if (isKakaoSDKLoaded && window.Kakao) {
      try {
        window.Kakao.Auth.authorize({
          redirectUri: KAKAO_REDIRECT_URI,
          scope: "profile_nickname, profile_image, account_email",
        });
      } catch (error) {
        console.error("Kakao login error:", error);
        alert("카카오 로그인 초기화에 실패했습니다. 다시 시도해주세요.");
      }
    } else {
      console.error("Kakao SDK is not loaded");
      alert(
        "카카오 SDK 로딩에 실패했습니다. 페이지를 새로고침 후 다시 시도해주세요."
      );
    }
  };

  return handleKakaoLogin;
};

export default useKakaoLogin;
