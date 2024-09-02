import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/layouts/Footer";
import Gnb from "./Gnb";
import * as S from "./Layout.styled";

// 인증 상태를 확인하는 커스텀 훅
const useAuth = () => {
  return (
    sessionStorage.getItem("token") !== null ||
    localStorage.getItem("refreshToken") !== null
  );
};

const RootLayout: React.FC = () => {
  const isAuthenticated = useAuth();
  const location = useLocation();

  const authPages = [
    "/intro",
    "/login",
    "/signUp",
    "/forgotPassword",
    "/resetPassword",
    "/login/email",
  ];
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <S.AppContainer>
      {!isAuthPage && <Gnb />}
      <S.Main>
        <Outlet />
      </S.Main>
      {!isAuthPage && <Footer />}
      <Toaster />
    </S.AppContainer>
  );
};
export default RootLayout;
