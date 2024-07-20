// components/signup/SignUp.styled.ts
import styled from "styled-components";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const SignUpContainer = styled.div`
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

export const Logo = styled.h1`
  font-size: 32px;
  margin-bottom: 20px;
  color: #8d6e63;
  font-weight: bold;
`;

export const Title = styled.h2`
  font-size: 24px;
  text-align: center;
  color: #8d6e63;
  margin-bottom: 20px;
`;

export const StyledForm = styled.form`
  width: 100%;
  margin: 10px 0;
`;

export const ErrorMessage = styled.span`
  color: #d32f2f;
  font-size: 14px;
  margin-top: -10px;
  margin-bottom: 5px;
  display: block;
`;

export const StyledInput = styled(Input)`
  margin-bottom: 15px;
  width: 100%;
  display: inline-block;
  padding: 12px;
  font-size: 16px;
`;
export const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

export const LabelDescription = styled.span`
  font-size: 10px;
  color: #888;
  margin-left: 4px;
`;

export const StyledLabel = styled.label`
  display: inline-block;
  color: #8d6e63;
`;

export const StyledButton = styled(Button)`
  width: 100%;
  margin-top: 20px;
  padding: 12px 0;
  font-size: 16px;
  background-color: #ffa000;
  color: #ffffff;
  border: none;
  &:hover {
    background-color: #ff8f00;
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0 8px;
  color: #8d6e63;
`;

export const LoginPrompt = styled.p`
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #8d6e63;
`;

export const LoginLink = styled(Link)`
  color: #ffa000;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s ease-in-out;
  margin-left: 2px;
  &:hover {
    color: #ff9100;
    text-decoration: underline;
  }
`;
