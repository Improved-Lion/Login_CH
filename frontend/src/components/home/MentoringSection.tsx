// MentoringSection.tsx
import styled from "styled-components";

const MentoringWrapper = styled.div`
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
`;

const MentorList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const MentorItem = styled.li`
  margin-bottom: 10px;
`;

const MentoringSection: React.FC = () => {
  const dummyMentors = [
    { id: 1, name: "김멘토", expertise: "웹 개발" },
    { id: 2, name: "이멘토", expertise: "모바일 앱 개발" },
    { id: 3, name: "박멘토", expertise: "데이터 사이언스" },
  ];

  return (
    <MentoringWrapper>
      <h3>인기 멘토</h3>
      <MentorList>
        {dummyMentors.map((mentor) => (
          <MentorItem key={mentor.id}>
            {mentor.name} - {mentor.expertise}
          </MentorItem>
        ))}
      </MentorList>
    </MentoringWrapper>
  );
};

export default MentoringSection;
