import "@testing-library/jest-dom";

// Mock Kakao SDK
(global as any).window.Kakao = {
  init: jest.fn(),
  isInitialized: jest.fn(),
  Auth: {
    authorize: jest.fn(),
  },
};
// Set environment variables
process.env.VITE_KAKAO_APP_KEY = "7c4b984298711ff20ce2635d66cf9367";
process.env.VITE_REDIRECT_URL = "http://localhost:5173/login";

// Mock import.meta.env for Vite
(global as any).import = {
  meta: {
    env: {
      VITE_KAKAO_APP_KEY: process.env.VITE_KAKAO_APP_KEY,
      VITE_REDIRECT_URL: process.env.VITE_REDIRECT_URL,
    },
  },
};
