import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  overflow: hidden;
  background-color: #fff8e1;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  @media (min-width: 1024px) {
    max-width: 100%;
  }
`;

export const Main = styled.main`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const GnbContainer = styled.nav`
  background-color: #ffa000;
  padding: 1rem;
  display: flex;
  width: 100%;
  max-width: 480px;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  @media (min-width: 1024px) {
    max-width: 100%;
  }
`;

export const Logo = styled(Link)`
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
  text-decoration: none;
`;

export const NavIcons = styled.div`
  display: flex;
  gap: 1rem;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
`;

export const Drawer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? "50%" : "calc(50% - 540px)")};
  transform: translateX(
    ${({ isOpen }) => (isOpen ? "calc(-50% - 140px)" : "calc(-50% - 340px)")}
  );
  width: 200px;
  height: 100%;
  background-color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
  @media (min-width: 1024px) {
    left: ${({ isOpen }) => (isOpen ? "0" : "-200px")};
    transform: none;
  }
`;

export const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #ffa000;
  color: white;
`;

export const DrawerContent = styled.div`
  padding: 1rem;
`;

export const DrawerLink = styled(Link)`
  display: block;
  padding: 0.5rem 0;
  color: #333;
  text-decoration: none;
  &:hover {
    color: #ffa000;
  }
`;

export const NavContainer = styled.nav`
  display: flex;
  width: 100%;
  max-width: 480px;
  justify-content: space-around;
  align-items: center;
  background-color: #fff8e1;
  border-top: 1px solid #e0e0e0;
  padding: 10px 0;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  @media (min-width: 1024px) {
    display: none;
  }
`;

export const NavItem = styled(NavLink)`
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
