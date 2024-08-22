import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import RootLayout from "@/layouts/RootLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Spinner from "@/components/common/Spinner";

const lazyLoad = (Component: React.LazyExoticComponent<any>, props?: any) => (
  <Suspense fallback={<Spinner />}>
    <Component {...props} />
  </Suspense>
);

const isAuthenticated = () =>
  sessionStorage.getItem("token") !== null ||
  localStorage.getItem("refreshToken") !== null;

const pages = {
  Home: lazy(() => import("@/pages/Home")),
  SignUp: lazy(() => import("@/pages/SignUp")),
  Login: lazy(() => import("@/pages/Login")),
  EmailLogin: lazy(() => import("@/pages/EmailLogin")),
  Intro: lazy(() => import("@/pages/Intro")),
  ForgotPassword: lazy(() => import("@/pages/ForgotPassword")),
  ResetPassword: lazy(() => import("@/pages/ResetPassword")),
  LoginCallback: lazy(() => import("@/components/login/LoginCallback")),
  Board: lazy(() => import("@/pages/Board")),
  Chat: lazy(() => import("@/pages/Chat")),
  Profile: lazy(() => import("@/pages/Profile")),
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <ProtectedRoute>{lazyLoad(pages.Home)}</ProtectedRoute>,
      },
      {
        path: "intro",
        element: isAuthenticated() ? (
          <Navigate to="/" replace />
        ) : (
          lazyLoad(pages.Intro)
        ),
      },
      {
        path: "signUp",
        element: isAuthenticated() ? (
          <Navigate to="/" replace />
        ) : (
          lazyLoad(pages.SignUp)
        ),
      },
      {
        path: "login",
        element: isAuthenticated() ? (
          <Navigate to="/" replace />
        ) : (
          lazyLoad(pages.Login)
        ),
      },
      {
        path: "login/email",
        element: isAuthenticated() ? (
          <Navigate to="/" replace />
        ) : (
          lazyLoad(pages.EmailLogin)
        ),
      },
      { path: "forgotPassword", element: lazyLoad(pages.ForgotPassword) },
      { path: "resetPassword", element: lazyLoad(pages.ResetPassword) },
      {
        path: "login/kakao/callback",
        element: lazyLoad(pages.LoginCallback, { provider: "kakao" }),
      },
      {
        path: "login/naver/callback",
        element: lazyLoad(pages.LoginCallback, { provider: "naver" }),
      },
      {
        path: "login/github/callback",
        element: lazyLoad(pages.LoginCallback, { provider: "github" }),
      },
      {
        path: "*",
        element: <Navigate to={isAuthenticated() ? "/" : "/intro"} replace />,
      },
      {
        path: "board",
        element: <ProtectedRoute>{lazyLoad(pages.Board)}</ProtectedRoute>,
      },
      {
        path: "chat",
        element: <ProtectedRoute>{lazyLoad(pages.Chat)}</ProtectedRoute>,
      },
      {
        path: "profile",
        element: <ProtectedRoute>{lazyLoad(pages.Profile)}</ProtectedRoute>,
      },
    ],
  },
]);

export default router;
