import React from "react";
import styled from "styled-components";

const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const CourseCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CourseTitle = styled.h3`
  margin: 0 0 10px 0;
`;

const CourseInfo = styled.p`
  margin: 5px 0;
`;

interface Course {
  id: number;
  title: string;
  instructor: string;
  price: number;
}

interface CourseListProps {
  courses: Course[];
}

const CourseList = ({ courses }: CourseListProps) => {
  return (
    <CourseGrid>
      {courses.map((course) => (
        <CourseCard key={course.id}>
          <CourseTitle>{course.title}</CourseTitle>
          <CourseInfo>강사: {course.instructor}</CourseInfo>
          <CourseInfo>가격: {course.price.toLocaleString()}원</CourseInfo>
        </CourseCard>
      ))}
    </CourseGrid>
  );
};

export default CourseList;
