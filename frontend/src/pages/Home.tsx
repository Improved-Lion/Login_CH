import { styled } from "styled-components";

const Home = () => {
  return (
    <HomeContainer>
      <h1>Welcome to Improved Lion</h1>
      {/* Add more content as needed */}
    </HomeContainer>
  );
};

export default Home;
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
`;
