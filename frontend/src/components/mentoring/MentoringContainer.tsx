// MentoringContainer.tsx
import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as S from "./Mentoring.styled";

// 더미 데이터
const dummySessions = [
  {
    id: 1,
    title: "React 마스터 클래스",
    mentorName: "김리액트",
    category: "프론트엔드",
    description: "React의 기초부터 고급 개념까지 배워봅시다.",
  },
  {
    id: 2,
    title: "Node.js 백엔드 개발",
    mentorName: "이노드",
    category: "백엔드",
    description: "Node.js를 이용한 서버 개발의 모든 것",
  },
  {
    id: 3,
    title: "데이터 분석 입문",
    mentorName: "박데이터",
    category: "데이터 사이언스",
    description: "Python과 pandas를 이용한 데이터 분석 기초",
  },
  {
    id: 4,
    title: "UI/UX 디자인 원칙",
    mentorName: "최디자인",
    category: "디자인",
    description: "사용자 중심의 UI/UX 디자인 방법론",
  },
];

const MentoringContainer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSessions = useMemo(() => {
    return dummySessions.filter(
      (session) =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.mentorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <S.BoardContainer>
      <S.Title>멘토링</S.Title>
      <S.Description>
        업계 선배들 혹은 동료들과 인사이트를 나눠 보세요. 더 빨리, 더 멀리 갈 수
        있어요.
      </S.Description>

      <S.SearchContainer>
        <Input
          type="text"
          placeholder="멘토 또는 주제 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button>
          <Search size={20} />
        </Button>
      </S.SearchContainer>

      <S.SessionGrid>
        {filteredSessions.map((session) => (
          <S.StyledCard key={session.id}>
            <CardHeader>
              <CardTitle>{session.title}</CardTitle>
              <CardDescription>
                {session.mentorName} • {session.category}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{session.description}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">멘토링 신청하기</Button>
            </CardFooter>
          </S.StyledCard>
        ))}
      </S.SessionGrid>
    </S.BoardContainer>
  );
};

export default MentoringContainer;
