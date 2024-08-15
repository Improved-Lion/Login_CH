import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import client from "@/api/client";

const useGoogleLogin = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  const handleGoogleLoginLogic = useCallback(
    async (response: any) => {
      try {
        console.log("Google login response:", response);
        const serverResponse = await client.post("/auth/google", {
          credential: response.credential,
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
            auto_select: false,
            cancel_on_tap_outside: true,
          });
        }
      };
    };

    loadGoogleScript();
  }, [handleGoogleLoginLogic]);

  const handleGoogleLogin = useCallback(() => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log("Google One Tap is not displayed or was skipped.");
          console.log(
            "Reason:",
            notification.getNotDisplayedReason() ||
              notification.getSkippedReason()
          );
        }
      });
    } else {
      console.error("Google API is not loaded");
    }
  }, []);

  return { handleGoogleLogin };
};

export default useGoogleLogin;
