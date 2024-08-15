import { Link } from "react-router-dom";
import * as S from "./Login.styled";
import useKakaoLogin from "@/hooks/useKakaoLogin";
import useNaverLogin from "@/hooks/useNaverLogin";

const SocialLoginButtons = () => {
  const { handleKakaoLogin, isKakaoInitialized } = useKakaoLogin();
  const { handleNaverLogin } = useNaverLogin();

  return (
    <S.SocialLoginContainer>
      <S.SocialButton
        $bgcolor="#FEE500"
        onClick={handleKakaoLogin}
        disabled={!isKakaoInitialized}
      >
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
