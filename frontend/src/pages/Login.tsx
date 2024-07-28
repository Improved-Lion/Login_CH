import { Link } from "react-router-dom";
import * as S from "@/components/login/Login.styled";
import { useAuthStore } from "@/store/authStore";
import SocialLoginButtons from "@/components/login/SocialLoginButtons";
import OtherLoginOptions from "@/components/login/OtherLoginOptions";
import { useEffect } from "react";

const Login = () => {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <S.LoginContainer>
      <S.Title>Improved Lion 로그인</S.Title>
      <SocialLoginButtons />
      <OtherLoginOptions />
      <S.SignUpLink>
        아직 회원이 아니신가요? <Link to="/signUp">회원 가입</Link>
      </S.SignUpLink>
    </S.LoginContainer>
  );
};

export default Login;
