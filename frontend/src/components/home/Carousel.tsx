// Carousel.tsx
import styled from "styled-components";

const CarouselWrapper = styled.div`
  overflow: hidden;
  width: 100%;
`;

const CarouselInner = styled.div`
  display: flex;
  transition: transform 0.3s ease-in-out;
`;

const CarouselItem = styled.div`
  flex: 0 0 100%;
  height: 200px;
  position: relative;
  background-size: cover;
  background-position: center;
`;

const CarouselTitle = styled.h3`
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
`;

interface Course {
  id: number;
  title: string;
  image: string;
}

interface CarouselProps {
  courses: Course[];
}

const Carousel = ({ courses }: CarouselProps) => {
  return (
    <CarouselWrapper>
      <CarouselInner>
        {courses.map((course) => (
          <CarouselItem
            key={course.id}
            style={{ backgroundImage: `url(${course.image})` }}
          >
            <CarouselTitle>{course.title}</CarouselTitle>
          </CarouselItem>
        ))}
      </CarouselInner>
    </CarouselWrapper>
  );
};

export default Carousel;
