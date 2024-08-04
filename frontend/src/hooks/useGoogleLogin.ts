import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import client from "@/api/client";

const useGoogleLogin = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  const handleGoogleLogin = useCallback(
    async (response: any) => {
      try {
        console.log("Google login response:", response);
        const serverResponse = await client.post("/auth/google", {
          credential: response.credential,
        });
        console.log("Server response:", serverResponse.data);

        if (serverResponse.data.ok === 1 && serverResponse.data.item) {
          const { token, ...userInfo } = serverResponse.data.item;
          sessionStorage.setItem("token", token.accessToken);
          localStorage.setItem("refreshToken", token.refreshToken);
          setToken(token.accessToken);
          setUser({
            ...userInfo,
            profileImageUrl: userInfo.profile_image_url, // 프로필 이미지 URL 설정
          });
          navigate("/");
        } else {
          throw new Error(serverResponse.data.message || "Login failed");
        }
      } catch (error) {
        console.error("Google login error:", error);
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    },
    [navigate, setToken, setUser]
  );

  return { handleGoogleLogin };
};

export default useGoogleLogin;
