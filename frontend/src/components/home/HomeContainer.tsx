import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import client from "@/api/client";
import UserInfo from "./UserInfo";
import LogoutButton from "./LogoutButton";
import { HomeWrapper } from "./Home.styled";

const HomeContainer = () => {
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const navigate = useNavigate();
  const { setToken, clearToken } = useAuthStore();

  const fetchUserInfo = useCallback(async (currentToken: string) => {
    try {
      const response = await client.get("/users/me", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      setUserName(response.data.full_name || response.data.username);
      setUserImage(response.data.profile_image_url || "");
    } catch (error) {
      console.error("Error fetching user info:", error);
      if ((error as any).response && (error as any).response.status === 401) {
        handleLogout();
      }
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken =
        sessionStorage.getItem("token") || localStorage.getItem("refreshToken");
      if (storedToken) {
        setToken(storedToken);
        await fetchUserInfo(storedToken);
      } else {
        navigate("/login");
      }
    };

    checkAuth();
  }, [setToken, fetchUserInfo, navigate]);

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <HomeWrapper>
      <UserInfo userName={userName} userImage={userImage} />
      <LogoutButton onLogout={handleLogout} />
    </HomeWrapper>
  );
};

export default HomeContainer;
