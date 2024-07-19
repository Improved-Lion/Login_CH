import styled from "styled-components";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  max-width: 480px; // 너비 증가
  width: 100%;
  margin: 0 auto;
`;

export const Logo = styled.h1`
  font-size: 32px;
  margin-bottom: 20px;
  color: #8d6e63; // 갈색 계열
  font-weight: bold;
`;

export const LionImage = styled.img`
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
`;

export const Title = styled.h2`
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  color: #8d6e63;
`;
export const StyledForm = styled.form`
  width: 100%;
`;

export const ErrorMessage = styled.span`
  color: #d32f2f;
  font-size: 14px;
  margin-top: -5px;
  margin-bottom: 10px;
  display: block;
`;

export const SocialButtonText = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const StyledInput = styled(Input)`
  margin-bottom: 10px;
  width: 100%;
  padding: 12px;
  font-size: 16px;
`;

export const StyledButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
  padding: 12px 0;
  font-size: 16px;
  background-color: #ffa000; // 진한 노란색
  color: #ffffff;
  border: none;
  &:hover {
    background-color: #ff8f00; // 호버 시 더 진한 노란색
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  color: #8d6e63;
`;

export const LinkContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  width: 100%;
  a {
    color: #8d6e63;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const SocialLoginContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  width: 100%;
`;

export const SocialButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: #ffffff;
`;
