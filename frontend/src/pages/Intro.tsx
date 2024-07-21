// src/pages/Intro.tsx
import styled from "styled-components";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Intro: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (name: string) => () => {
    navigate(`/${name}`);
  };
  return (
    <IntroContainer>
      <Title>Improved Lion</Title>
      <LionImage src="/Improved Lion.png" alt="Improved Lion" />
      <ButtonContainer>
        <StyledButton name="login" onClick={handleNavigate("login")}>
          로그인
        </StyledButton>
        <StyledButton name="signup" onClick={handleNavigate("signup")}>
          회원가입
        </StyledButton>
      </ButtonContainer>
    </IntroContainer>
  );
};

export default Intro;
const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 20px;
  color: #8d6e63; // 갈색 계열
  font-weight: bold;
`;

const LionImage = styled.img`
  width: 200px;
  height: 200px;
  margin-bottom: 30px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 250px;
`;

const StyledButton = styled(Button)`
  margin-bottom: 15px;
  padding: 12px 0;
  font-size: 16px;
  background-color: #ffa000; // 진한 노란색
  color: #ffffff;
  border: none;
  &:hover {
    background-color: #ff8f00; // 호버 시 더 진한 노란색
  }
`;
