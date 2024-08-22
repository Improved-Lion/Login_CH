import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import client from "@/api/client";

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: {
      init: (params: {
        appId: string;
        cookie?: boolean;
        xfbml?: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: {
          authResponse: { accessToken: string } | null;
        }) => void,
        params: { scope: string }
      ) => void;
    };
  }
}

const useFacebookLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isFBInitialized, setIsFBInitialized] = useState(false);

  useEffect(() => {
    // Facebook SDK 초기화
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v16.0", // 최신 버전 사용
      });

      setIsFBInitialized(true);
    };

    // Facebook SDK 스크립트 로드
    (function (d: Document, s: string, id: string) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  const handleFacebookLogin = useCallback(() => {
    if (!isFBInitialized) {
      console.error("Facebook SDK is not initialized yet");
      return;
    }

    window.FB.login(
      function (response) {
        if (response.authResponse) {
          // 서버에 인증 정보 전송
          client
            .post("/auth/facebook", {
              accessToken: response.authResponse.accessToken,
            })
            .then((res) => {
              if (res.data.ok === 1 && res.data.item) {
                const { token, ...userInfo } = res.data.item;
                const user = {
                  id: userInfo._id,
                  email: userInfo.email,
                  username: userInfo.name,
                  type: userInfo.type,
                  login_type: "facebook",
                };
                login(token.accessToken, token.refreshToken, user);
                navigate("/");
              } else {
                throw new Error(res.data.message || "Login failed");
              }
            })
            .catch((error) => {
              console.error("Facebook login error:", error);
              alert("로그인에 실패했습니다. 다시 시도해주세요.");
            });
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      },
      { scope: "public_profile,email" }
    );
  }, [isFBInitialized, navigate, login]);

  return { handleFacebookLogin };
};

export default useFacebookLogin;
