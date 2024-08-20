import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, User } from "@/store/authStore";
import client from "@/api/client";
import axios from "axios";

const useGithubLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleGithubLogin = useCallback(() => {
    const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/login/github/callback`;
    const scope = "user:email";
    const state = Math.random().toString(36).substring(7);

    sessionStorage.setItem("githubOAuthState", state);

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${scope}&state=${state}`;

    window.location.href = githubAuthUrl;
  }, []);

  const handleGithubCallback = useCallback(
    async (code: string, state: string) => {
      try {
        console.log("Attempting GitHub login...");

        const savedState = sessionStorage.getItem("githubOAuthState");
        if (state !== savedState) {
          throw new Error("Invalid state parameter");
        }

        const response = await client.post("/auth/github", { code });
        console.log("GitHub login response:", response.data);

        if (response.data.ok === 1 && response.data.item) {
          const { token, ...userInfo } = response.data.item;
          console.log("GitHub login successful", userInfo);

          const user: User = {
            id: userInfo._id,
            email: userInfo.email,
            username: userInfo.name,
            type: userInfo.type,
            login_type: "github",
          };

          login(token.accessToken, token.refreshToken, user);
          navigate("/");
        } else {
          throw new Error(response.data.message || "Login failed");
        }
      } catch (error) {
        console.error("GitHub login error:", error);
        let errorMessage = "로그인에 실패했습니다. 다시 시도해주세요.";
        if (axios.isAxiosError(error) && error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          errorMessage = `로그인 실패: ${
            error.response.data.message || error.message
          }`;
        } else if (error instanceof Error) {
          errorMessage = `로그인 실패: ${error.message}`;
        }
        alert(errorMessage);
        navigate("/login");
      } finally {
        sessionStorage.removeItem("githubOAuthState");
      }
    },
    [navigate, login]
  );

  return { handleGithubLogin, handleGithubCallback };
};

export default useGithubLogin;
