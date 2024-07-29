import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import LoginContainer from "@/components/login/LoginContainer";

const Login = () => {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <LoginContainer />;
};

export default Login;
