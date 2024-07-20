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
  width: 120px;
  height: 120px;
  margin: 10px 0;
`;

export const Title = styled.h2`
  font-size: 24px;
  text-align: center;
  color: #8d6e63;
`;
export const StyledForm = styled.form`
  width: 100%;
  height: 30%;
  margin: 10px 0;
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
  display: inline-block;
  padding: 12px;
  font-size: 16px;
`;
export const StyledLabel = styled.label`
  display: inline-block;
  margin-bottom: 4px;
  color: #8d6e63;
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

export const LoginEtcContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  gap: 10px;
`;
export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #8d6e63;
  width: 30%;
`;

export const LinkContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  text-align: center;
  a {
    color: #8d6e63;
    text-decoration: none;
    min-width: 60px;
    text-align: center;
    &:hover {
      text-decoration: underline;
    }
  }
`;
export const SocialLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 15px;
`;
export const SocialLoginText = styled.p`
  color: #8d6e63;
  font-size: 14px;
  text-align: center;
`;
export const SocialText = styled.div`
  display: flex;
  align-items: center;
  color: #8d6e63;
  font-size: 14px;
  text-align: center;
  width: 100%;
  margin: 20px 0;

  span {
    padding: 0 10px;
  }
`;
export const SocialButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
  width: 100%;
  gap: 20px;
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
export const VerticalDivider = styled.hr`
  display: inline-block;
  margin-top: 5px;
  border-left: 1px solid #8d6e63; //오른쪽에만 선 부여
  height: 15px;
`;
export const HorizontalDivider = styled.hr`
  flex-grow: 1;
  border: 0;
  height: 1px;
  background-color: #8d6e63;
`;
