// pages/Login.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  LoginContainer,
  Logo,
  Title,
  StyledInput,
  StyledButton,
  CheckboxContainer,
  LinkContainer,
  SocialLoginContainer,
  SocialButton,
  LionImage,
  StyledForm,
  ErrorMessage,
  SocialButtonText,
} from "@/components/login/Login.styled";
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
    <LoginContainer>
      <Logo>Improved Lion</Logo>
      <LionImage src="/Improved Lion.png" alt="Improved Lion" />
      <Title>회원 로그인</Title>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="username">아이디</label>
        <StyledInput
          id="username"
          {...register("username")}
          placeholder="아이디"
          aria-invalid={errors.username ? "true" : "false"}
        />
        {errors.username && (
          <ErrorMessage>{errors.username.message}</ErrorMessage>
        )}

        <label htmlFor="password">비밀번호</label>
        <StyledInput
          id="password"
          {...register("password")}
          type="password"
          placeholder="비밀번호"
          aria-invalid={errors.password ? "true" : "false"}
        />
        {errors.password && (
          <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}

        <StyledButton type="submit">로그인</StyledButton>
        <CheckboxContainer>
          <Checkbox id="remember" {...register("rememberMe")} />
          <label htmlFor="remember">로그인 유지</label>
        </CheckboxContainer>
      </StyledForm>
      <LinkContainer>
        <Link to="/signup">회원가입</Link>
        <Link to="/forgot-password">정보찾기</Link>
      </LinkContainer>
      <div>또는</div>
      <SocialLoginContainer>
        <SocialButton
          style={{ backgroundColor: "#03C75A" }}
          aria-label="네이버로 로그인"
        >
          <SocialButtonText>네이버</SocialButtonText>N
        </SocialButton>
        <SocialButton
          style={{ backgroundColor: "#FEE500" }}
          aria-label="카카오로 로그인"
        >
          <SocialButtonText>카카오</SocialButtonText>K
        </SocialButton>
        <SocialButton
          style={{ backgroundColor: "#1877F2" }}
          aria-label="페이스북으로 로그인"
        >
          <SocialButtonText>페이스북</SocialButtonText>f
        </SocialButton>
        <SocialButton
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #CCCCCC",
            color: "#333",
          }}
          aria-label="구글로 로그인"
        >
          <SocialButtonText>구글</SocialButtonText>G
        </SocialButton>
      </SocialLoginContainer>
    </LoginContainer>
  );
};

export default Login;
