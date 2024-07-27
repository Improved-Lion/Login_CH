import { SubmitErrorHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as S from "@/components/login/Login.styled";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import client from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import { AxiosError } from "axios";
import { FieldErrors } from "react-hook-form";
import { StyledLabel } from "@/styles/CommonStyles";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";

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

const EmailLogin = () => {
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
      navigate("/");
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
      <S.Title>이메일로 로그인</S.Title>
      <S.StyledForm onSubmit={handleSubmit(onSubmit, onError)}>
        <S.StyledInput
          id="email"
          {...register("email")}
          placeholder="이메일"
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <S.ErrorMessage>{errors.email.message}</S.ErrorMessage>
        )}

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

        <S.RememberLoginContainer>
          <Checkbox
            id="remember"
            {...register("rememberMe")}
            onCheckedChange={(checked) => {
              if (typeof checked === "boolean") {
                setValue("rememberMe", checked);
              }
            }}
          />
          <StyledLabel htmlFor="rememberLogin">로그인 상태 유지</StyledLabel>
        </S.RememberLoginContainer>

        <S.StyledButton
          type="submit"
          disabled={isSubmitting || loginMutation.status === "pending"}
        >
          {isSubmitting || loginMutation.status === "pending"
            ? "로그인 중..."
            : "로그인"}
        </S.StyledButton>
      </S.StyledForm>

      <S.SignUpLink>
        아직 회원이 아니신가요? <Link to="/signUp">회원 가입</Link>
      </S.SignUpLink>
    </S.LoginContainer>
  );
};

export default EmailLogin;
