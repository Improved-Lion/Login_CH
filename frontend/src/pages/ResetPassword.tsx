import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import * as S from "@/styles/CommonStyles";

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const { token } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>();

  const onSubmit: SubmitHandler<ResetPasswordFormData> = (data) => {
    // 여기에 비밀번호 재설정 로직을 구현합니다.
    // API가 구현되면 실제 요청을 보내도록 수정해야 합니다.
    console.log("비밀번호 재설정 요청:", data.password, "토큰:", token);
    alert("비밀번호가 성공적으로 변경되었습니다. (실제로 변경되지 않음)");
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
