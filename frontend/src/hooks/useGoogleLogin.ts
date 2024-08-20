import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import client from "@/api/client";

const useGoogleLogin = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  const handleGoogleLoginLogic = useCallback(
    async (response: any) => {
      try {
        console.log("Google login response:", response);
        const serverResponse = await client.post("/auth/google", {
          credential: response.credential || response.code, // credential 또는 code 사용
        });
        console.log("Server response:", serverResponse.data);

        if (serverResponse.data.ok === 1 && serverResponse.data.item) {
          const { token, ...userInfo } = serverResponse.data.item;
          sessionStorage.setItem("token", token.accessToken);
          localStorage.setItem("refreshToken", token.refreshToken);
          setToken(token.accessToken);
          setUser({
            ...userInfo,
            profileImageUrl: userInfo.profile_image_url,
          });
          navigate("/");
        } else {
          throw new Error(serverResponse.data.message || "Login failed");
        }
      } catch (error) {
        console.error("Google login error:", error);
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    },
    [navigate, setToken, setUser]
  );

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.google && window.google.accounts) {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleLoginLogic,
          });
          setIsGoogleLoaded(true);
        }
      };
    };

    loadGoogleScript();
  }, [handleGoogleLoginLogic]);

  const handleGoogleLogin = useCallback(() => {
    if (isGoogleLoaded && window.google && window.google.accounts) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log("Google sign-in prompt not displayed or skipped");
          // 대체 로그인 방법 사용
          const client = window.google.accounts.oauth2.initCodeClient({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            scope: "email profile",
            ux_mode: "popup",
            callback: (response: { code: string }) => {
              if (response.code) {
                handleGoogleLoginLogic(response);
              }
            },
          });
          client.requestCode();
        }
      });
    } else {
      console.error("Google API is not loaded");
      alert(
        "Google 로그인을 현재 사용할 수 없습니다. 잠시 후 다시 시도해주세요."
      );
    }
  }, [isGoogleLoaded, handleGoogleLoginLogic]);

  return { handleGoogleLogin, isGoogleLoaded };
};

export default useGoogleLogin;
