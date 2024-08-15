import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, User } from "@/store/authStore";
import client from "@/api/client";

interface GithubAuthResponse {
  ok: number;
  item?: {
    token: {
      accessToken: string;
      refreshToken: string;
    };
    user: {
      id?: number;
      email: string;
      username: string;
      full_name?: string;
      profile_image_url?: string;
      provider?: string;
      provider_id?: string;
      type?: string;
      login_type?: string;
      phone?: string;
      address?: string;
      created_at?: string;
      updated_at?: string;
    };
  };
  message?: string;
}

const useGithubLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleGithubLogin = useCallback(() => {
    const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/login/github/callback`;
    const scope = "user:email";

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    window.location.href = githubAuthUrl;
  }, []);

  const handleGithubCallback = useCallback(
    async (code: string) => {
      try {
        const response = await client.post<GithubAuthResponse>("/auth/github", {
          code,
        });

        if (response.data.ok === 1 && response.data.item) {
          const { token, user } = response.data.item;

          // 서버 응답의 user 객체를 User 인터페이스에 맞게 변환
          const userInfo: User = {
            id: user.id,
            email: user.email,
            username: user.username,
            full_name: user.full_name,
            profile_image_url: user.profile_image_url,
            provider: user.provider,
            provider_id: user.provider_id,
            type: user.type,
            login_type: user.login_type,
            phone: user.phone,
            address: user.address,
            created_at: user.created_at ? new Date(user.created_at) : undefined,
            updated_at: user.updated_at ? new Date(user.updated_at) : undefined,
          };

          login(token.accessToken, token.refreshToken, userInfo);
          navigate("/");
        } else {
          throw new Error(response.data.message || "Login failed");
        }
      } catch (error) {
        console.error("GitHub login error:", error);
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    },
    [navigate, login]
  );

  return { handleGithubLogin, handleGithubCallback };
};

export default useGithubLogin;
