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
      <Route path="/intro" element={<Intro />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="*"
        element={
          <Navigate
            to={sessionStorage.getItem("authorizedUser") ? "/" : "/intro"}
            replace
          />
        }
      />
    </Route>
  )
);

export default router;
