import { useState, useCallback, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import styled from "styled-components";
import { ColDef } from "ag-grid-community";

const StyledCommunityContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const GridContainer = styled.div`
  height: 600px;
  width: 100%;
`;

const categoryColors: { [key: string]: string } = {
  "웹 개발": "#FF6B6B",
  "모바일 앱 개발": "#4ECDC4",
  "데이터 사이언스": "#90E",
  "클라우드 컴퓨팅": "#FFA07A",
  DevOps: "#e8c800",
};

// 더미 데이터 생성 함수
const createDummyData = () => {
  const categories = [
    "웹 개발",
    "모바일 앱 개발",
    "데이터 사이언스",
    "클라우드 컴퓨팅",
    "DevOps",
  ];
  const tags = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "AWS",
    "Docker",
    "Kubernetes",
    "Machine Learning",
  ];
  const users = [
    { id: 1, username: "john_doe", full_name: "John Doe" },
    { id: 2, username: "jane_smith", full_name: "Jane Smith" },
    { id: 3, username: "bob_johnson", full_name: "Bob Johnson" },
  ];

  return Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    category_id: Math.floor(Math.random() * categories.length) + 1,
    category: categories[Math.floor(Math.random() * categories.length)],
    author_id: users[Math.floor(Math.random() * users.length)].id,
    author: users[Math.floor(Math.random() * users.length)].full_name,
    title: `IT 강의 주제 ${index + 1}`,
    content: `이것은 IT 강의 ${
      index + 1
    }의 내용입니다. 여기에 더 자세한 설명이 들어갑니다.`,
    views: Math.floor(Math.random() * 1000),
    created_at: new Date(
      Date.now() - Math.floor(Math.random() * 10000000000)
    ).toISOString(),
    updated_at: new Date(
      Date.now() - Math.floor(Math.random() * 1000000000)
    ).toISOString(),
    is_deleted: Math.random() < 0.1,
    tags: Array.from(
      { length: Math.floor(Math.random() * 3) + 1 },
      () => tags[Math.floor(Math.random() * tags.length)]
    ),
    likes: Math.floor(Math.random() * 50),
    comments: Math.floor(Math.random() * 20),
  }));
};

const CommunityContainer = () => {
  const [rowData] = useState(createDummyData());

  const [columnDefs] = useState<ColDef[]>([
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "category",
      headerName: "카테고리",
      filter: true,
      cellStyle: (params) => {
        return {
          color: categoryColors[params.value] || "#FFFFFF",
          //color: "#FFFFFF",
        };
      },
    },
    { field: "title", headerName: "제목", flex: 1 },
    { field: "author", headerName: "작성자", filter: true },
    {
      field: "created_at",
      headerName: "작성일",
      filter: "agDateColumnFilter",
      valueFormatter: (params) =>
        new Date(params.value as string).toLocaleDateString(),
    },
    { field: "likes", headerName: "좋아요", width: 100 },
    { field: "comments", headerName: "댓글", width: 100 },
    {
      field: "views",
      headerName: "조회수",
      width: 100,
      cellStyle: { fontWeight: "bold" },
    },
    {
      field: "tags",
      headerName: "태그",
      valueFormatter: (params) => (params.value as string[]).join(", "),
      width: 200,
    },
  ]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
    }),
    []
  );

  const onGridReady = useCallback(
    (params: { api: { sizeColumnsToFit: () => void } }) => {
      params.api.sizeColumnsToFit();
    },
    []
  );

  return (
    <StyledCommunityContainer>
      <h1>IT 강의 커뮤니티</h1>
      <GridContainer className="ag-theme-alpine">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={20}
        />
      </GridContainer>
    </StyledCommunityContainer>
  );
};

export default CommunityContainer;
