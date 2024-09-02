// Footer.tsx
import {
  Home,
  GraduationCap,
  BookOpen,
  MessageCircle,
  User,
  UsersRound,
} from "lucide-react";
import * as S from "./Layout.styled";

const Footer: React.FC = () => {
  return (
    <S.NavContainer>
      <S.NavItem to="/">
        <Home size={24} />
        Home
      </S.NavItem>
      <S.NavItem to="/mentoring">
        <GraduationCap size={24} />
        Mentoring
      </S.NavItem>
      <S.NavItem to="/lecture">
        <BookOpen size={24} />
        Lecture
      </S.NavItem>
      <S.NavItem to="/chat">
        <MessageCircle size={24} />
        Chat
      </S.NavItem>
      <S.NavItem to="/community">
        <UsersRound size={24} />
        Community
      </S.NavItem>
    </S.NavContainer>
  );
};

export default Footer;
