import React, { useState } from "react";
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
    profile_image: z.instanceof(File).optional(),
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

const signUpUser = async (formData: FormData): Promise<SignUpResponse> => {
  console.log("signUpUser called with data:", formData);
  const response = await client.post<SignUpResponse>(
    "/auth/register",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
        alert(`회원가입 실패: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        alert("서버로부터 응답이 없습니다.");
      } else {
        alert(`오류: ${error.message}`);
      }
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    console.log("onSubmit called with data:", data);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "confirmPassword" && key !== "agreeTerms") {
        if (key === "profile_image" && value instanceof File) {
          formData.append(key, value, value.name);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      }
    });

    // FormData의 내용을 로그로 출력
    Array.from(formData.entries()).forEach(([key, value]) => {
      if (value instanceof File) {
        console.log(key, value.name, value.type, value.size);
      } else {
        console.log(key, value);
      }
    });

    signUpMutation.mutate(formData);
  };
  const onError: SubmitErrorHandler<SignUpFormData> = (errors) => {
    console.error("Form validation failed:", errors);
  };
  const [selectedFileName, setSelectedFileName] =
    useState<string>("선택된 파일 없음");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profile_image", file);
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFileName("선택된 파일 없음");
      setImagePreview(null);
    }
  };

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

        <S.LabelWrapper>
          <S.StyledLabel htmlFor="profile_image">프로필 이미지</S.StyledLabel>
          <S.LabelDescription>(선택)</S.LabelDescription>
        </S.LabelWrapper>
        <S.FileInputWrapper>
          <S.FileInputLabel htmlFor="profile_image">파일 선택</S.FileInputLabel>
          <S.HiddenFileInput
            id="profile_image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <S.SelectedFileName>{selectedFileName}</S.SelectedFileName>
        </S.FileInputWrapper>
        {imagePreview && (
          <S.ImagePreview src={imagePreview} alt="Profile preview" />
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
