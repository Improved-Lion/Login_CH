import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import RootLayout from "@/layouts/RootLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Spinner from "@/components/common/Spinner";

const lazyLoad = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
  <Suspense fallback={<Spinner />}>
    <Component />
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
        path: "*",
        element: <Navigate to={isAuthenticated() ? "/" : "/intro"} replace />,
      },
    ],
  },
]);

export default router;
