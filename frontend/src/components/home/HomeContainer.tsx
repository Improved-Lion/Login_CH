import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import client from "@/api/client";
import UserInfo from "./UserInfo";
import LogoutButton from "./LogoutButton";
import { HomeWrapper } from "./Home.styled";
import axios from "axios";

const HomeContainer = () => {
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const navigate = useNavigate();
  const { token, setToken, setUser, logout } = useAuthStore();

  const fetchUserInfo = useCallback(async () => {
    if (!token) return;
    try {
      const response = await client.get("/users/me");
      const userData = response.data;
      setUser(userData);
      setUserName(userData.full_name || userData.username);
      setUserImage(userData.profile_image_url || "");
    } catch (error) {
      console.error("Error fetching user info:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleLogout();
      }
    }
  }, [token, setUser]);

  const handleLogout = useCallback(() => {
    logout();
    sessionStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  }, [logout, navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = sessionStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken) {
        setToken(accessToken);
        await fetchUserInfo();
      } else if (refreshToken) {
        try {
          const response = await client.post("/auth/refresh", { refreshToken });
          const newAccessToken = response.data.accessToken;
          sessionStorage.setItem("token", newAccessToken);
          setToken(newAccessToken);
          await fetchUserInfo();
        } catch (error) {
          console.error("Error refreshing token:", error);
          handleLogout();
        }
      } else {
        handleLogout();
      }
    };

    checkAuth();
  }, [setToken, fetchUserInfo, handleLogout]);

  return (
    <HomeWrapper>
      <UserInfo userName={userName} userImage={userImage} />
      <LogoutButton onLogout={handleLogout} />
    </HomeWrapper>
  );
};

export default HomeContainer;
