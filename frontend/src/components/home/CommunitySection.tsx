// CommunitySection.tsx
import styled from "styled-components";

const CommunityWrapper = styled.div`
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
`;

const PostList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const PostItem = styled.li`
  margin-bottom: 15px;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CommunitySection: React.FC = () => {
  const dummyPosts = [
    { id: 1, title: "React Hooks 사용 팁", author: "리액트매니아", likes: 15 },
    {
      id: 2,
      title: "JavaScript 성능 최적화 방법",
      author: "JS고수",
      likes: 22,
    },
    {
      id: 3,
      title: "초보 개발자를 위한 GitHub 사용법",
      author: "깃허브친구",
      likes: 18,
    },
  ];

  return (
    <CommunityWrapper>
      <h3>인기 게시글</h3>
      <PostList>
        {dummyPosts.map((post) => (
          <PostItem key={post.id}>
            <h4>{post.title}</h4>
            <p>
              작성자: {post.author} | 좋아요: {post.likes}
            </p>
          </PostItem>
        ))}
      </PostList>
    </CommunityWrapper>
  );
};

export default CommunitySection;
