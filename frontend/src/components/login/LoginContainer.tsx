import { Link } from "react-router-dom";
import * as S from "./Login.styled";
import SocialLoginButtons from "./SocialLoginButtons";
import OtherLoginOptions from "./OtherLoginOptions";

const LoginContainer = () => {
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

export default LoginContainer;
