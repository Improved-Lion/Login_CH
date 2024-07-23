import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import client from "@/api/client";

const Home = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { token, clearToken } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchUserInfo();
    } else {
      navigate("/login");
    }
  }, [token]);

  const fetchUserInfo = async () => {
    try {
      const response = await client.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserName(response.data.full_name || response.data.username);
    } catch (error) {
      console.error("Error fetching user info:", error);
      if ((error as any).response && (error as any).response.status === 401) {
        await handleLogout();
      }
    }
  };

  const handleLogout = async () => {
    await clearToken();
    navigate("/login");
  };

  return (
    <HomeContainer>
      <h1>Welcome, {userName}</h1>
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
