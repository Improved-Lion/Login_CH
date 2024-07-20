// pages/SignUp.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as S from "@/components/signUp/SignUp.styled";
import { Checkbox } from "@/components/ui/checkbox";

const schema = z
  .object({
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
    nickname: z.string().min(1, { message: "닉네임을 입력해주세요" }),
    name: z.string().min(1, { message: "이름을 입력해주세요" }),
    agreeTerms: z
      .boolean()
      .or(z.string())
      .refine((val) => val === true || val === "true", {
        message: "이용약관에 동의해주세요",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof schema>;

const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: SignUpFormData) => {
    console.log(data);
    // 여기에 회원가입 로직 추가
  };

  return (
    <S.SignUpContainer>
      <S.Logo>Improved Lion</S.Logo>
      <S.Title>회원가입</S.Title>
      <S.StyledForm onSubmit={handleSubmit(onSubmit)}>
        <S.LabelWrapper>
          <S.StyledLabel htmlFor="email">아이디</S.StyledLabel>
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
          <S.StyledLabel htmlFor="nickname">닉네임</S.StyledLabel>
          <S.LabelDescription style={{ color: "#991709" }}>
            (필수)
          </S.LabelDescription>
        </S.LabelWrapper>
        <S.StyledInput
          id="nickname"
          {...register("nickname")}
          placeholder="닉네임"
          aria-invalid={errors.nickname ? "true" : "false"}
        />
        {errors.nickname && (
          <S.ErrorMessage>{errors.nickname.message}</S.ErrorMessage>
        )}

        <S.LabelWrapper>
          <S.StyledLabel htmlFor="name">이름</S.StyledLabel>
          <S.LabelDescription>(선택)</S.LabelDescription>
        </S.LabelWrapper>
        <S.StyledInput
          id="name"
          {...register("name")}
          placeholder="이름"
          aria-invalid={errors.name ? "true" : "false"}
        />
        {errors.name && <S.ErrorMessage>{errors.name.message}</S.ErrorMessage>}

        <S.CheckboxContainer>
          <Checkbox id="agreeTerms" {...register("agreeTerms")} />
          <S.StyledLabel htmlFor="agreeTerms">
            이용약관에 동의합니다
          </S.StyledLabel>
        </S.CheckboxContainer>
        {errors?.agreeTerms && (
          <S.ErrorMessage>{errors?.agreeTerms.message}</S.ErrorMessage>
        )}

        <S.StyledButton type="submit">회원가입</S.StyledButton>
      </S.StyledForm>
      <S.LoginPrompt>
        이미 계정이 있으신가요? <S.LoginLink to="/login">로그인</S.LoginLink>
      </S.LoginPrompt>
    </S.SignUpContainer>
  );
};

export default SignUp;
