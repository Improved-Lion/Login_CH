import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LoginContainer from "@/components/login/LoginContainer";

const renderWithRouter = (ui: React.ReactElement, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(ui, { wrapper: BrowserRouter });
};

describe("LoginContainer", () => {
  it("renders login title", () => {
    renderWithRouter(<LoginContainer />);
    expect(screen.getByText("Improved Lion 로그인")).toBeInTheDocument();
  });

  it("renders social login buttons", () => {
    renderWithRouter(<LoginContainer />);
    expect(screen.getByText("Kakao로 로그인")).toBeInTheDocument();
    expect(screen.getByText("Naver로 로그인")).toBeInTheDocument();
    expect(screen.getByText("이메일로 로그인")).toBeInTheDocument();
  });

  it("renders sign up link", () => {
    renderWithRouter(<LoginContainer />);
    expect(screen.getByText("회원 가입")).toBeInTheDocument();
  });
});
