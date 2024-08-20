import { useEffect } from "react";
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

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    console.log(
      `LoginCallback: provider=${provider}, code=${code}, state=${state}`
    );

    if (code) {
      switch (provider) {
        case "kakao":
          handleKakaoCallback(code);
          break;
        case "naver":
          if (state) handleNaverCallback(code, state);
          break;
        case "github":
          if (state) handleGithubCallback(code, state);
          break;
        default:
          console.error("Unknown provider:", provider);
          navigate("/login");
      }
    } else {
      console.error("No code found in URL");
      navigate("/login");
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
