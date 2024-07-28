import { Link } from "react-router-dom";
import * as S from "./Login.styled";
import useKakaoLogin from "@/hooks/useKakaoLogin";

const SocialLoginButtons = () => {
  const handleKakaoLogin = useKakaoLogin();

  return (
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
  );
};

export default SocialLoginButtons;
