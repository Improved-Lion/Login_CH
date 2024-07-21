import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import * as S from "@/styles/CommonStyles";

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = (data) => {
    // 여기에 비밀번호 찾기 로직을 구현합니다.
    // API가 구현되면 실제 요청을 보내도록 수정해야 합니다.
    console.log("비밀번호 찾기 요청:", data.email);
    alert(
      `비밀번호 재설정 링크가 ${data.email}로 전송되었습니다. (실제로 전송되지 않음)`
    );
  };

  return (
    <S.Container>
      <S.Logo>Improved Lion</S.Logo>
      <S.Title>비밀번호 찾기</S.Title>
      <S.StyledForm onSubmit={handleSubmit(onSubmit)}>
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
        <S.StyledButton type="submit">비밀번호 재설정 링크 받기</S.StyledButton>
      </S.StyledForm>
      <S.LinkText>
        <Link to="/login">로그인 페이지로 돌아가기</Link>
      </S.LinkText>
    </S.Container>
  );
};

export default ForgotPassword;
