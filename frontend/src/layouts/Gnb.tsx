// Gnb.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import * as S from "./Layout.styled";

const Gnb = () => {
  const [DrawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <S.GnbContainer>
        <S.IconButton onClick={() => setDrawerOpen(true)}>
          <Menu size={24} />
        </S.IconButton>
        <S.Logo to="/">Improved Lion</S.Logo>
        <S.NavIcons>
          <S.IconButton as={Link} to="/cart">
            <ShoppingCart size={24} />
          </S.IconButton>
          <S.IconButton as={Link} to="/profile">
            <User size={24} />
          </S.IconButton>
        </S.NavIcons>
      </S.GnbContainer>
      <S.Drawer isOpen={DrawerOpen}>
        <S.DrawerHeader>
          <h2>Menu</h2>
          <S.IconButton onClick={() => setDrawerOpen(false)}>
            <X size={24} />
          </S.IconButton>
        </S.DrawerHeader>
        <S.DrawerContent>
          <S.DrawerLink to="/mentoring">멘토링</S.DrawerLink>
          <S.DrawerLink to="/lecture">강의</S.DrawerLink>
          <S.DrawerLink to="/community">커뮤니티</S.DrawerLink>
          <S.DrawerLink to="/about">서비스 소개</S.DrawerLink>
        </S.DrawerContent>
      </S.Drawer>
    </>
  );
};

export default Gnb;
