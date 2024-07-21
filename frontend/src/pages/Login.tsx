import { useEffect } from "react";
import { SubmitErrorHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as S from "@/components/login/Login.styled";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import client from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import { AxiosError } from "axios";
import { FieldErrors } from "react-hook-form";

const schema = z.object({
  email: z.string().email({ message: "올바른 이메일을 입력해주세요" }),
  password: z.string().min(1, { message: "비밀번호를 입력해주세요" }),
  rememberMe: z.boolean().optional().default(false),
});

type LoginFormData = z.infer<typeof schema>;
type LoginResponse = { message: string; token: string };

const loginUser = async (
  data: Omit<LoginFormData, "rememberMe">
): Promise<LoginResponse> => {
  console.log("loginUser called with data:", data);
  const response = await client.post<LoginResponse>("/auth/login", data);
  return response.data;
};

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const setToken = useAuthStore((state) => state.setToken);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("Login successful:", data);
      const { token } = data;
      const rememberMe = watch("rememberMe");

      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      setToken(token);
      navigate("/"); // '/home' 대신 '/'로 수정
    },
    onError: (error: AxiosError) => {
      console.error("Login error:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        alert(`Login failed: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response received from server");
      } else {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
      }
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("onSubmit called with data:", data);
    const { rememberMe, ...loginData } = data;
    loginMutation.mutate(loginData);
  };

  const onError: SubmitErrorHandler<LoginFormData> = (errors: FieldErrors) => {
    console.error("Form validation failed:", errors);
  };

  useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      console.log("Form value changed:", value, name, type)
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form errors:", errors);
    }
  }, [errors]);

  return (
    <S.LoginContainer>
      <S.Logo>Improved Lion</S.Logo>
      <S.LionImage src="/Improved Lion.png" alt="Improved Lion" />
      <S.Title>회원 로그인</S.Title>
      <S.StyledForm onSubmit={handleSubmit(onSubmit, onError)}>
        <S.StyledLabel htmlFor="email">이메일</S.StyledLabel>
        <S.StyledInput
          id="email"
          {...register("email")}
          placeholder="이메일"
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <S.ErrorMessage>{errors.email.message}</S.ErrorMessage>
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

        <S.LoginEtcContainer>
          <S.CheckboxContainer>
            <Checkbox
              id="remember"
              {...register("rememberMe")}
              onCheckedChange={(checked) => {
                if (typeof checked === "boolean") {
                  setValue("rememberMe", checked);
                }
              }}
            />
            <S.StyledLabel htmlFor="remember">로그인 유지</S.StyledLabel>
          </S.CheckboxContainer>
          <S.LinkContainer>
            <Link to="/signUp">회원가입</Link>
            <S.VerticalDivider />
            <Link to="/forgotPassword">비밀번호 찾기</Link>
          </S.LinkContainer>
        </S.LoginEtcContainer>

        <S.StyledButton
          type="submit"
          disabled={isSubmitting || loginMutation.status === "pending"}
          onClick={() => console.log("Login button clicked")}
        >
          {isSubmitting || loginMutation.status === "pending"
            ? "로그인 중..."
            : "로그인"}
        </S.StyledButton>
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
