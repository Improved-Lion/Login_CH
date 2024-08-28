import styled from "styled-components";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/layouts/Footer";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  background-color: #fff8e1;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Main = styled.main`
  flex: 1;
  overflow-y: auto;
`;

const RootLayout = () => {
  return (
    <AppContainer>
      <Main>
        <Outlet />
      </Main>
      <Footer />
      <Toaster />
    </AppContainer>
  );
};

export default RootLayout;
