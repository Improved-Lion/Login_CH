import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useKakaoLogin from "@/hooks/useKakaoLogin";
import useNaverLogin from "@/hooks/useNaverLogin";
import useGithubLogin from "@/hooks/useGithubLogin";

interface LoginCallbackProps {
  provider: "kakao" | "naver" | "github";
}

const LoginCallback = ({ provider }: LoginCallbackProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleKakaoCallback } = useKakaoLogin();
  const { handleNaverCallback } = useNaverLogin();
  const { handleGithubCallback } = useGithubLogin();
  const hasProcessed = useRef(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code && !hasProcessed.current) {
      hasProcessed.current = true;
      switch (provider) {
        case "kakao":
          handleKakaoCallback(code);
          break;
        case "naver":
          if (state) handleNaverCallback(code, state);
          break;
        case "github":
          handleGithubCallback(code);
          break;
      }
    } else if (!code) {
      navigate("/login", { replace: true });
    }
  }, [
    location,
    navigate,
    provider,
    handleKakaoCallback,
    handleNaverCallback,
    handleGithubCallback,
  ]);

  return <div>Processing login...</div>;
};

export default LoginCallback;
