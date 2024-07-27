import styled from "styled-components";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Container = styled.div`
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
  margin-top: -5px;
  margin-bottom: 10px;
  display: block;
`;

export const StyledInput = styled(Input)`
  margin-bottom: 15px;
  width: 100%;
  display: inline-block;
  padding: 12px;
  font-size: 16px;
`;

export const StyledLabel = styled.label`
  display: inline-block;
  color: #8d6e63;
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

export const LinkText = styled.p`
  margin-top: 20px;
  text-align: center;
  color: #8d6e63;
  a {
    color: #ffa000;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;
