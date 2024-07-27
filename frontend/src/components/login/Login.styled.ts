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
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
`;

export const Title = styled.h2`
  font-size: 24px;
  text-align: center;
  color: #8d6e63;
  margin-bottom: 20px;
`;

export const StyledForm = styled.form`
  width: 100%;
  margin: 20px 0;
`;

export const StyledInput = styled(Input)`
  margin-bottom: 10px;
  width: 100%;
  padding: 12px;
  font-size: 16px;
`;

export const ErrorMessage = styled.span`
  color: #d32f2f;
  font-size: 14px;
  margin-top: -5px;
  margin-bottom: 10px;
  display: block;
`;

export const StyledButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
  padding: 12px 0;
  font-size: 16px;
  background-color: #ffa000;
  color: #ffffff;
  border: none;
  &:hover {
    background-color: #ff8f00;
  }
`;

export const SocialLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin: 20px 0;
`;

export const SocialButton = styled.button<{ $bgcolor: string }>`
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  background-color: ${(props) => props.$bgcolor};
  color: ${(props) => (props.$bgcolor === "#03C75A" ? "white" : "#333")};
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${(props) => {
      const rgb = parseInt(props.$bgcolor.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      return `rgb(${Math.max(0, r - 15)}, ${Math.max(0, g - 15)}, ${Math.max(
        0,
        b - 15
      )})`;
    }};
  }
`;

export const SocialButtonIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 10px;
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

export const OtherLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

export const OtherLoginButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

export const OtherLoginIcon = styled.img`
  width: 32px;
  height: 32px;
`;

export const RememberLoginContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 20px;
`;

export const SignUpLink = styled.p`
  text-align: center;
  font-size: 14px;
  color: #8d6e63;
  a {
    color: #6d4c41;
    font-weight: bold;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
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
