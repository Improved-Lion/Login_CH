import * as S from "@/components/login/Login.styled";

const OtherLoginOptions = () => {
  return (
    <>
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
    </>
  );
};

export default OtherLoginOptions;
