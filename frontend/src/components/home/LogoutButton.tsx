import { StyledLogoutButton } from "./Home.styled";

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  return <StyledLogoutButton onClick={onLogout}>로그아웃</StyledLogoutButton>;
};

export default LogoutButton;
