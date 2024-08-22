import { NavLink } from "react-router-dom";
import styled from "styled-components";
import {
  Home,
  Clipboard,
  MessageCircle,
  User,
  ShoppingBag,
} from "lucide-react";

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fff8e1;
  border-top: 1px solid #e0e0e0;
  padding: 10px 0;
`;

const NavItem = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #707070;
  text-decoration: none;
  font-size: 12px;

  &.active {
    color: #ffa000;
  }
`;

const Gnb: React.FC = () => {
  return (
    <NavContainer>
      <NavItem to="/" end>
        <Home size={24} />
        Home
      </NavItem>
      <NavItem to="/board">
        <Clipboard size={24} />
        Board
      </NavItem>
      <NavItem to="/shop">
        <ShoppingBag size={24} />
        Shop
      </NavItem>

      <NavItem to="/chat">
        <MessageCircle size={24} />
        Chat
      </NavItem>
      <NavItem to="/profile">
        <User size={24} />
        Profile
      </NavItem>
    </NavContainer>
  );
};

export default Gnb;
