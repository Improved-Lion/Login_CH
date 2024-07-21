import { useEffect } from "react";
import { SubmitErrorHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as S from "@/components/signUp/SignUp.styled";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import client from "@/api/client";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const schema = z
  .object({
    username: z.string().min(1, { message: "사용자명을 입력해주세요" }),
    email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요" }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            "비밀번호는 영문 대/소문자, 숫자, 특수문자를 포함해야 하며, 대문자 1글자가 필수입니다",
        }
      ),
    confirmPassword: z.string(),
    full_name: z.string().optional(),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "이용약관에 동의해주세요",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof schema>;
interface User {
  id?: number;
  username: string;
  email: string;
  full_name?: string;
  profile_image_url?: string;
  created_at?: string;
  updated_at?: string;
}

type SignUpResponse = {
  message: string;
  user: User;
  token: string;
};

const signUpUser = async (
  data: Omit<SignUpFormData, "confirmPassword" | "agreeTerms">
): Promise<SignUpResponse> => {
  console.log("signUpUser called with data:", data);
  const response = await client.post<SignUpResponse>("/auth/register", data);
  return response.data;
};
const SignUp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      agreeTerms: false,
    },
  });

  const signUpMutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: (data) => {
      console.log("SignUp successful:", data);
      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    },
    onError: (error: AxiosError) => {
      console.error("SignUp error:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        alert(`SignUp failed: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response received from server");
      } else {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
      }
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    console.log("onSubmit called with data:", data);
    const { confirmPassword, agreeTerms, ...signUpData } = data;
    signUpMutation.mutate(signUpData);
  };

  const onError: SubmitErrorHandler<SignUpFormData> = (errors) => {
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
    <S.SignUpContainer>
      <S.Logo>Improved Lion</S.Logo>
      <S.Title>회원가입</S.Title>
      <S.StyledForm onSubmit={handleSubmit(onSubmit, onError)}>
        <S.LabelWrapper>
          <S.StyledLabel htmlFor="username">사용자명</S.StyledLabel>
          <S.LabelDescription style={{ color: "#991709" }}>
            (필수)
          </S.LabelDescription>
        </S.LabelWrapper>
        <S.StyledInput
          id="username"
          {...register("username")}
          placeholder="사용자명"
          aria-invalid={errors.username ? "true" : "false"}
        />
        {errors.username && (
          <S.ErrorMessage>{errors.username.message}</S.ErrorMessage>
        )}

        <S.LabelWrapper>
          <S.StyledLabel htmlFor="email">이메일</S.StyledLabel>
          <S.LabelDescription style={{ color: "#991709" }}>
            (필수)
          </S.LabelDescription>
        </S.LabelWrapper>
        <S.StyledInput
          id="email"
          {...register("email")}
          placeholder="이메일 주소"
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <S.ErrorMessage>{errors.email.message}</S.ErrorMessage>
        )}

        <S.LabelWrapper>
          <S.StyledLabel htmlFor="password">비밀번호</S.StyledLabel>
          <S.LabelDescription style={{ color: "#991709" }}>
            (필수)
          </S.LabelDescription>
        </S.LabelWrapper>
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

        <S.LabelWrapper>
          <S.StyledLabel htmlFor="confirmPassword">비밀번호 확인</S.StyledLabel>
          <S.LabelDescription style={{ color: "#991709" }}>
            (필수)
          </S.LabelDescription>
        </S.LabelWrapper>
        <S.StyledInput
          id="confirmPassword"
          {...register("confirmPassword")}
          type="password"
          placeholder="비밀번호 확인"
          aria-invalid={errors.confirmPassword ? "true" : "false"}
        />
        {errors.confirmPassword && (
          <S.ErrorMessage>{errors.confirmPassword.message}</S.ErrorMessage>
        )}

        <S.LabelWrapper>
          <S.StyledLabel htmlFor="full_name">이름</S.StyledLabel>
          <S.LabelDescription>(선택)</S.LabelDescription>
        </S.LabelWrapper>
        <S.StyledInput
          id="full_name"
          {...register("full_name")}
          placeholder="이름"
          aria-invalid={errors.full_name ? "true" : "false"}
        />
        {errors.full_name && (
          <S.ErrorMessage>{errors.full_name.message}</S.ErrorMessage>
        )}

        <S.CheckboxContainer>
          <Checkbox
            id="agreeTerms"
            {...register("agreeTerms")}
            onCheckedChange={(checked) => {
              if (typeof checked === "boolean") {
                setValue("agreeTerms", checked);
              }
            }}
          />
          <S.StyledLabel htmlFor="agreeTerms">
            이용약관에 동의합니다
          </S.StyledLabel>
        </S.CheckboxContainer>
        {errors.agreeTerms && (
          <S.ErrorMessage>{errors.agreeTerms.message}</S.ErrorMessage>
        )}

        <S.StyledButton
          type="submit"
          disabled={isSubmitting || signUpMutation.status === "pending"}
          onClick={() => console.log("SignUp button clicked")}
        >
          {isSubmitting || signUpMutation.status === "pending"
            ? "가입 중..."
            : "회원가입"}
        </S.StyledButton>
      </S.StyledForm>
      <S.LoginPrompt>
        이미 계정이 있으신가요? <S.LoginLink to="/login">로그인</S.LoginLink>
      </S.LoginPrompt>
    </S.SignUpContainer>
  );
};

export default SignUp;
