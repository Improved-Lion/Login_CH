import styled from "styled-components";
import { Card } from "../ui/card";

export const BoardContainer = styled.div`
  padding: 1rem;
  background-color: #fff8e1;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #ffa000;
`;

export const Description = styled.p`
  margin-bottom: 1.5rem;
  color: #8d6e63;
  font-size: 1.1rem;
`;

export const SearchContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  gap: 0.5rem;
`;

export const SessionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

export const StyledCard = styled(Card)`
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(255, 160, 0, 0.1);
  }
`;
