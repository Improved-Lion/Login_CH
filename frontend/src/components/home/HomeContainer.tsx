import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import client from "@/api/client";
import UserInfo from "./UserInfo";
import LogoutButton from "./LogoutButton";
import * as S from "./Home.styled";
import axios from "axios";
import Carousel from "./Carousel";
import CourseList from "./CourseList";
import MentoringSection from "./MentoringSection";
import ChatSection from "./ChatSection";
import CommunitySection from "./CommunitySection";

const dummyFeaturedCourses = [
  {
    id: 1,
    title: "React 마스터 클래스",
    image: "https://via.placeholder.com/800x400?text=React+Master+Class",
  },
  {
    id: 2,
    title: "Node.js 완전 정복",
    image: "https://via.placeholder.com/800x400?text=Node.js+Complete+Guide",
  },
  {
    id: 3,
    title: "파이썬으로 시작하는 데이터 사이언스",
    image: "https://via.placeholder.com/800x400?text=Python+Data+Science",
  },
];

const dummyNewCourses = [
  { id: 4, title: "GraphQL 실전 가이드", instructor: "김그래프", price: 55000 },
  {
    id: 5,
    title: "Flutter로 만드는 크로스 플랫폼 앱",
    instructor: "이플러터",
    price: 66000,
  },
  {
    id: 6,
    title: "AWS 클라우드 아키텍처 설계",
    instructor: "박클라우드",
    price: 77000,
  },
];

const dummyPopularCourses = [
  {
    id: 7,
    title: "자바스크립트 ES6+ 심화",
    instructor: "최자바",
    price: 44000,
  },
  {
    id: 8,
    title: "타입스크립트 실전 프로젝트",
    instructor: "정타입",
    price: 58000,
  },
  {
    id: 9,
    title: "Docker & Kubernetes 완전 정복",
    instructor: "김컨테이너",
    price: 88000,
  },
];
const HomeContainer = () => {
  //const [userName, setUserName] = useState("");
  //const [userImage, setUserImage] = useState("");
  //const navigate = useNavigate();
  //const { token, setToken, setUser, logout } = useAuthStore();

  //const fetchUserInfo = useCallback(async () => {
  //  if (!token) return;
  //  try {
  //    const response = await client.get("/users/me");
  //    const userData = response.data;
  //    setUser(userData);
  //    setUserName(userData.full_name || userData.username);
  //    setUserImage(userData.profile_image_url || "");
  //  } catch (error) {
  //    console.error("Error fetching user info:", error);
  //    if (axios.isAxiosError(error) && error.response?.status === 401) {
  //      handleLogout();
  //    }
  //  }
  //}, [token, setUser]);

  //const handleLogout = useCallback(() => {
  //  logout();
  //  sessionStorage.removeItem("token");
  //  localStorage.removeItem("refreshToken");
  //  navigate("/login");
  //}, [logout, navigate]);

  //useEffect(() => {
  //  const checkAuth = async () => {
  //    const accessToken = sessionStorage.getItem("token");
  //    const refreshToken = localStorage.getItem("refreshToken");

  //    if (accessToken) {
  //      setToken(accessToken);
  //      await fetchUserInfo();
  //    } else if (refreshToken) {
  //      try {
  //        const response = await client.post("/auth/refresh", { refreshToken });
  //        const newAccessToken = response.data.accessToken;
  //        sessionStorage.setItem("token", newAccessToken);
  //        setToken(newAccessToken);
  //        await fetchUserInfo();
  //      } catch (error) {
  //        console.error("Error refreshing token:", error);
  //        handleLogout();
  //      }
  //    } else {
  //      handleLogout();
  //    }
  //  };

  //  checkAuth();
  //}, [setToken, fetchUserInfo, handleLogout]);

  return (
    <S.HomeWrapper>
      {/*<UserInfo userName={userName} userImage={userImage} />
      <LogoutButton onLogout={handleLogout} />*/}
      <S.Section>
        <Carousel courses={dummyFeaturedCourses} />
      </S.Section>

      <S.Section>
        <S.SectionTitle>최신 강의</S.SectionTitle>
        <CourseList courses={dummyNewCourses} />
      </S.Section>

      <S.Section>
        <S.SectionTitle>인기 강의</S.SectionTitle>
        <CourseList courses={dummyPopularCourses} />
      </S.Section>

      <S.Section>
        <S.SectionTitle>멘토링</S.SectionTitle>
        <MentoringSection />
      </S.Section>

      <S.Section>
        <S.SectionTitle>실시간 채팅</S.SectionTitle>
        <ChatSection />
      </S.Section>

      <S.Section>
        <S.SectionTitle>커뮤니티</S.SectionTitle>
        <CommunitySection />
      </S.Section>
    </S.HomeWrapper>
  );
};

export default HomeContainer;
