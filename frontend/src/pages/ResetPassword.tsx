import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as S from "@/styles/CommonStyles";
import client from "@/api/client";
import axios from "axios";
import { useEffect } from "react";

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, verificationCode } = location.state as {
    email: string;
    verificationCode: string;
  };

  useEffect(() => {
    if (!email || !verificationCode) {
      alert("잘못된 접근입니다. 비밀번호 찾기 페이지로 이동합니다.");
      navigate("/forgotPassword");
    }
  }, [email, verificationCode, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>();

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    try {
      console.log("Sending request with:", {
        email,
        password: data.password,
        verificationCode,
      });
      const response = await client.post("/users/reset-password", {
        email,
        password: data.password,
        verificationCode,
      });
      alert(response.data.message || "비밀번호가 성공적으로 변경되었습니다.");
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("서버 응답:", error.response.data);
        alert(`비밀번호 재설정 실패: ${error.response.data.message}`);
      } else {
        console.error("비밀번호 재설정 오류:", error);
        alert("비밀번호 재설정에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <S.Container>
      <S.Logo>Improved Lion</S.Logo>
      <S.Title>비밀번호 재설정</S.Title>
      <S.StyledForm onSubmit={handleSubmit(onSubmit)}>
        <S.StyledLabel htmlFor="password">새 비밀번호</S.StyledLabel>
        <S.StyledInput
          id="password"
          type="password"
          {...register("password", { required: "새 비밀번호를 입력해주세요" })}
          placeholder="새 비밀번호"
        />
        {errors.password && (
          <S.ErrorMessage>{errors.password.message}</S.ErrorMessage>
        )}

        <S.StyledLabel htmlFor="confirmPassword">비밀번호 확인</S.StyledLabel>
        <S.StyledInput
          id="confirmPassword"
          type="password"
          {...register("confirmPassword", {
            required: "비밀번호를 다시 입력해주세요",
            validate: (val: string) => {
              if (watch("password") != val) {
                return "비밀번호가 일치하지 않습니다";
              }
            },
          })}
          placeholder="비밀번호 확인"
        />
        {errors.confirmPassword && (
          <S.ErrorMessage>{errors.confirmPassword.message}</S.ErrorMessage>
        )}

        <S.StyledButton type="submit">비밀번호 변경</S.StyledButton>
      </S.StyledForm>
      <S.LinkText>
        <Link to="/login">로그인 페이지로 돌아가기</Link>
      </S.LinkText>
    </S.Container>
  );
};

export default ResetPassword;
