import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import HomeContainer from "@/components/home/HomeContainer";
import client from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import userEvent from "@testing-library/user-event";

jest.mock("@/api/client");
jest.mock("@/store/authStore");

const mockedClient = client as jest.Mocked<typeof client>;
const mockedUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;

const renderWithRouter = (ui: React.ReactElement, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(ui, { wrapper: BrowserRouter });
};

describe("HomeContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAuthStore.mockImplementation(() => ({
      token: "test-token",
      user: null,
      isInitialized: true,
      setToken: jest.fn(),
      setUser: jest.fn(),
      clearToken: jest.fn(),
      initialize: jest.fn(),
    }));
  });

  it("fetches and displays user info", async () => {
    mockedClient.get.mockResolvedValue({
      data: {
        full_name: "Test User",
        profile_image_url: "test-image-url",
      },
    });

    renderWithRouter(<HomeContainer />);

    await waitFor(() => {
      expect(screen.getByText("Welcome, Test User")).toBeInTheDocument();
      expect(screen.getByAltText("Test User")).toHaveAttribute(
        "src",
        "test-image-url"
      );
    });
  });

  it("handles logout", async () => {
    const mockClearToken = jest.fn();
    mockedUseAuthStore.mockImplementation(() => ({
      token: "test-token",
      setToken: jest.fn(),
      clearToken: mockClearToken,
      user: { full_name: "Test User", profile_image_url: "test-image-url" },
      isInitialized: true,
    }));

    renderWithRouter(<HomeContainer />);

    const logoutButton = await screen.findByText("로그아웃");
    await userEvent.click(logoutButton);

    expect(mockClearToken).toHaveBeenCalled();
  });
});
