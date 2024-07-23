import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as S from "@/styles/CommonStyles";
import client from "@/api/client";
import axios from "axios";

interface ForgotPasswordFormData {
  email: string;
  verificationCode?: string;
}

const ForgotPassword = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>();

  const sendVerificationCode: SubmitHandler<ForgotPasswordFormData> = async (
    data
  ) => {
    try {
      await client.post("/users/send-verification-code", { email: data.email });
      setIsEmailSent(true);
      alert("인증 번호가 이메일로 전송되었습니다.");
    } catch (error) {
      console.error("Error sending verification code:", error);
      alert("인증 번호 전송에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const verifyCode = async () => {
    try {
      const email = watch("email");
      const response = await client.post("/users/verify-code", {
        email,
        verificationCode,
      });
      if (response.data.isValid) {
        navigate("/resetPassword", {
          state: {
            email,
            verificationCode,
          },
        });
      } else {
        alert("잘못된 인증 번호입니다. 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`인증 번호 확인 실패: ${error.response.data.message}`);
      } else {
        alert("인증 번호 확인에 실패했습니다. 다시 시도해 주세요.");
      }
    }
  };

  return (
    <S.Container>
      <S.Logo>Improved Lion</S.Logo>
      <S.Title>비밀번호 찾기</S.Title>
      <S.StyledForm onSubmit={handleSubmit(sendVerificationCode)}>
        <S.StyledLabel htmlFor="email">이메일</S.StyledLabel>
        <S.StyledInput
          id="email"
          type="email"
          {...register("email", { required: "이메일을 입력해주세요" })}
          placeholder="이메일 주소"
        />
        {errors.email && (
          <S.ErrorMessage>{errors.email.message}</S.ErrorMessage>
        )}
        <S.StyledButton type="submit" disabled={isEmailSent}>
          {isEmailSent ? "인증 번호 전송됨" : "인증 번호 받기"}
        </S.StyledButton>
      </S.StyledForm>
      {isEmailSent && (
        <S.StyledForm
          onSubmit={(e) => {
            e.preventDefault();
            verifyCode();
          }}
        >
          <S.StyledLabel htmlFor="verificationCode">인증 번호</S.StyledLabel>
          <S.StyledInput
            id="verificationCode"
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="인증 번호 입력"
          />
          <S.StyledButton type="submit">인증 확인</S.StyledButton>
        </S.StyledForm>
      )}
      <S.LinkText>
        <Link to="/login">로그인 페이지로 돌아가기</Link>
      </S.LinkText>
    </S.Container>
  );
};

export default ForgotPassword;
