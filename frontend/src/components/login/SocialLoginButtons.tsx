import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useCallback } from "react";
import * as S from "./Login.styled";
import useKakaoLogin from "@/hooks/useKakaoLogin";
import useNaverLogin from "@/hooks/useNaverLogin";

const SocialLoginButtons = () => {
  const { handleKakaoLogin, handleKakaoCallback } = useKakaoLogin();
  const { handleNaverLogin, handleNaverCallback } = useNaverLogin();
  const location = useLocation();
  const navigate = useNavigate();

  const handleCallback = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code) {
      if (state) {
        // Naver Login
        handleNaverCallback(code, state);
      } else {
        // Kakao Login
        handleKakaoCallback(code);
      }
      // URL 파라미터 제거
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, handleNaverCallback, handleKakaoCallback, navigate]);

  useEffect(() => {
    handleCallback();
  }, [handleCallback]);

  return (
    <S.SocialLoginContainer>
      <S.SocialButton $bgcolor="#FEE500" onClick={handleKakaoLogin}>
        <S.SocialButtonIcon src="/kakao.webp" alt="Kakao" />
        Kakao로 로그인
      </S.SocialButton>
      <S.SocialButton $bgcolor="#03C75A" onClick={handleNaverLogin}>
        <S.SocialButtonIcon src="/naver.webp" alt="Naver" />
        Naver로 로그인
      </S.SocialButton>
      <S.SocialButton as={Link} to="/login/email" $bgcolor="#CCCCCC">
        <S.SocialButtonIcon src="/mail.svg" alt="Email" />
        이메일로 로그인
      </S.SocialButton>
    </S.SocialLoginContainer>
  );
};

export default SocialLoginButtons;
