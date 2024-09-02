import styled from "styled-components";

export const HomeWrapper = styled.div`
  //display: flex;
  //flex-direction: column;
  //align-items: center;
  //justify-content: center;
  //height: 100%;
  //padding: 12px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 480px;
  margin: 0 auto;
  @media (min-width: 1024px) {
    max-width: 100%;
  }
`;
export const Section = styled.section`
  margin-bottom: 40px;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #ffa000;
  padding-bottom: 10px;
`;
export const UserImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin: 20px 0;
  border: 3px solid #ffffee;
`;

export const StyledLogoutButton = styled.button`
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
