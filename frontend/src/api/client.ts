import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3000/api", // 백엔드 서버 URL
});

export default client;
