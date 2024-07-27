import { Link, useNavigate } from "react-router-dom";
import * as S from "@/components/login/Login.styled";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore"; // 인증 상태 관리 스토어
import client from "@/api/client";

const Login = () => {
  const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY;
  const KAKAO_REDIRECT_URI = import.meta.env.VITE_REDIRECT_URL; // 동적으로 현재 도메인 사용
  //const KAKAO_REDIRECT_URI = `${window.location.origin}/login`; // 동적으로 현재 도메인 사용
  const navigate = useNavigate();
  const { setToken, setUser, initialize } = useAuthStore();
  const [isKakaoSDKLoaded, setIsKakaoSDKLoaded] = useState(false);

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

  useEffect(() => {
    const initializeKakao = async () => {
      if (typeof window.Kakao === "undefined") {
        await loadKakaoSDK();
      } else if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_APP_KEY);
      }
      setIsKakaoSDKLoaded(true);
    };

    initializeKakao();
    initialize();
  }, [initialize]);

  const handleKakaoCallback = async (code: string) => {
    try {
      console.log("Sending request to server with code:", code);
      const response = await client.post("/auth/kakao", { code });
      console.log("Server response:", response.data);

      if (response.data.ok === 1 && response.data.item) {
        const { token, ...userInfo } = response.data.item;

        sessionStorage.setItem("token", token.accessToken);
        localStorage.setItem("refreshToken", token.refreshToken);

        setToken(token.accessToken);
        setUser(userInfo);

        console.log("Login successful, navigating to home");
        navigate("/"); // 즉시 홈으로 이동
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Kakao login error:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error details:", error.response.data);
        alert(
          `로그인 실패: ${
            error.response.data.message ||
            error.response.data.error ||
            "알 수 없는 오류"
          }`
        );
      } else {
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      handleKakaoCallback(code);
      // 코드를 사용한 후 URL에서 제거
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

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

  return (
    <S.LoginContainer>
      <S.Title>Improved Lion 로그인</S.Title>
      <S.SocialLoginContainer>
        <S.SocialButton $bgcolor="#FEE500" onClick={handleKakaoLogin}>
          <S.SocialButtonIcon src="/kakao.webp" alt="Kakao" />
          Kakao로 로그인
        </S.SocialButton>
        <S.SocialButton $bgcolor="#03C75A">
          <S.SocialButtonIcon src="/naver.webp" alt="Naver" />
          Naver로 로그인
        </S.SocialButton>
        <S.SocialButton as={Link} to="/login/email" $bgcolor="#CCCCCC">
          <S.SocialButtonIcon src="/mail.svg" alt="Email" />
          이메일로 로그인
        </S.SocialButton>
      </S.SocialLoginContainer>

      <S.SocialText>
        <S.HorizontalDivider />
        <span>다른 방법으로 로그인</span>
        <S.HorizontalDivider />
      </S.SocialText>

      <S.OtherLoginContainer>
        <S.OtherLoginButton>
          <S.OtherLoginIcon src="/google.webp" alt="Google" />
        </S.OtherLoginButton>
        <S.OtherLoginButton>
          <S.OtherLoginIcon src="/facebook.webp" alt="Facebook" />
        </S.OtherLoginButton>
        <S.OtherLoginButton>
          <S.OtherLoginIcon src="/github.webp" alt="GitHub" />
        </S.OtherLoginButton>
        <S.OtherLoginButton>
          <S.OtherLoginIcon src="/apple.webp" alt="Apple" />
        </S.OtherLoginButton>
      </S.OtherLoginContainer>

      <S.SignUpLink>
        아직 회원이 아니신가요? <Link to="/signUp">회원 가입</Link>
      </S.SignUpLink>
    </S.LoginContainer>
  );
};

export default Login;
