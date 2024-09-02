// ChatSection.tsx
import styled from "styled-components";

const ChatWrapper = styled.div`
  background-color: #e6f7ff;
  padding: 20px;
  border-radius: 8px;
`;

const ChatRoomList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ChatRoomItem = styled.li`
  margin-bottom: 10px;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
`;

const ChatSection: React.FC = () => {
  const dummyChatRooms = [
    {
      id: 1,
      name: "React 스터디",
      lastMessage: "다들 오늘 회의 시간 어떠세요?",
    },
    {
      id: 2,
      name: "JavaScript 질문방",
      lastMessage: "클로저에 대해 궁금한 점이 있어요.",
    },
    {
      id: 3,
      name: "취업 준비 모임",
      lastMessage: "포트폴리오 리뷰 부탁드립니다.",
    },
  ];

  return (
    <ChatWrapper>
      <h3>활성 채팅방</h3>
      <ChatRoomList>
        {dummyChatRooms.map((room) => (
          <ChatRoomItem key={room.id}>
            <strong>{room.name}</strong>
            <p>{room.lastMessage}</p>
          </ChatRoomItem>
        ))}
      </ChatRoomList>
    </ChatWrapper>
  );
};

export default ChatSection;
