// pages/Login.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as S from "@/components/login/Login.styled";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

const schema = z.object({
  username: z.string().min(1, { message: "아이디를 입력해주세요" }),
  password: z.string().min(1, { message: "비밀번호를 입력해주세요" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof schema>;

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };

  return (
    <S.LoginContainer>
      <S.Logo>Improved Lion</S.Logo>
      <S.LionImage src="/Improved Lion.png" alt="Improved Lion" />
      <S.Title>회원 로그인</S.Title>
      <S.StyledForm onSubmit={handleSubmit(onSubmit)}>
        <S.StyledLabel htmlFor="username">아이디</S.StyledLabel>
        <S.StyledInput
          id="username"
          {...register("username")}
          placeholder="아이디"
          aria-invalid={errors.username ? "true" : "false"}
        />
        {errors.username && (
          <S.ErrorMessage>{errors.username.message}</S.ErrorMessage>
        )}

        <S.StyledLabel htmlFor="password">비밀번호</S.StyledLabel>
        <S.StyledInput
          id="password"
          {...register("password")}
          type="password"
          placeholder="비밀번호"
          aria-invalid={errors.password ? "true" : "false"}
        />
        {errors.password && (
          <S.ErrorMessage>{errors.password.message}</S.ErrorMessage>
        )}

        <S.StyledButton type="submit">로그인</S.StyledButton>
        <S.LoginEtcContainer>
          <S.CheckboxContainer>
            <Checkbox id="remember" {...register("rememberMe")} />
            <S.StyledLabel htmlFor="remember">로그인 유지</S.StyledLabel>
          </S.CheckboxContainer>
          <S.LinkContainer>
            <Link to="/signUp">회원가입</Link>
            <S.VerticalDivider />
            <Link to="/forgotPassword">정보찾기</Link>
          </S.LinkContainer>
        </S.LoginEtcContainer>
      </S.StyledForm>
      <S.SocialText>
        <S.HorizontalDivider />
        <span>또는</span>
        <S.HorizontalDivider />
      </S.SocialText>

      <S.SocialLoginContainer>
        <S.SocialLoginText>SNS 계정으로 로그인</S.SocialLoginText>
        <S.SocialButtonContainer>
          <S.SocialButton
            style={{ backgroundColor: "#03C75A" }}
            aria-label="네이버로 로그인"
          >
            <S.SocialButtonText>네이버</S.SocialButtonText>N
          </S.SocialButton>
          <S.SocialButton
            style={{ backgroundColor: "#FEE500" }}
            aria-label="카카오로 로그인"
          >
            <S.SocialButtonText>카카오</S.SocialButtonText>K
          </S.SocialButton>
          <S.SocialButton
            style={{ backgroundColor: "#1877F2" }}
            aria-label="페이스북으로 로그인"
          >
            <S.SocialButtonText>페이스북</S.SocialButtonText>f
          </S.SocialButton>
          <S.SocialButton
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #CCCCCC",
              color: "#333",
            }}
            aria-label="구글로 로그인"
          >
            <S.SocialButtonText>구글</S.SocialButtonText>G
          </S.SocialButton>
        </S.SocialButtonContainer>
      </S.SocialLoginContainer>
    </S.LoginContainer>
  );
};

export default Login;
