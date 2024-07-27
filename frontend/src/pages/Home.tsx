import { useEffect, useState, useCallback } from "react";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import client from "@/api/client";

const Home = () => {
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const navigate = useNavigate();
  const { token, setToken, clearToken } = useAuthStore();

  const fetchUserInfo = useCallback(async (currentToken: string) => {
    try {
      const response = await client.get("/users/me", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      setUserName(response.data.full_name || response.data.username);
      setUserImage(response.data.profile_image_url || ""); // 프로필 이미지 URL 설정
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
    <HomeContainer>
      <h1>Welcome, {userName}</h1>
      {userImage && <UserImage src={userImage} alt={userName} />}
      <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
    </HomeContainer>
  );
};

export default Home;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
`;

const UserImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin: 20px 0;
  border: 3px solid #ffffee; // 노란색 테두리 추가
`;

const LogoutButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #d32f2f;
  }
`;
