// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthorized =
    sessionStorage.getItem("token") !== null ||
    localStorage.getItem("refreshToken") !== null;

  if (!isAuthorized) {
    return <Navigate to="/intro" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
