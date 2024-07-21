import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import Home from "@/pages/Home";
import SignUp from "@/pages/SignUp";
import Login from "@/pages/Login";
import Intro from "@/pages/Intro";
import ProtectedRoute from "@/routes/ProtectedRoute";

const isAuthenticated = () => {
  return sessionStorage.getItem("token") || localStorage.getItem("token");
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route
        index
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/intro"
        element={isAuthenticated() ? <Navigate to="/" replace /> : <Intro />}
      />
      <Route
        path="/signUp"
        element={isAuthenticated() ? <Navigate to="/" replace /> : <SignUp />}
      />
      <Route
        path="/login"
        element={isAuthenticated() ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated() ? "/" : "/intro"} replace />}
      />
    </Route>
  )
);

export default router;
