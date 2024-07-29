import { renderHook, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import useKakaoLogin from "@/hooks/useKakaoLogin";
import client from "@/api/client";
import { useAuthStore } from "@/store/authStore";

jest.mock("@/api/client");
jest.mock("@/store/authStore");

const mockedClient = client as jest.Mocked<typeof client>;
const mockedUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;

const renderHookWithRouter = (hook: any) => {
  return renderHook(hook, {
    wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
  });
};

describe("useKakaoLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup the global Kakao object
    (window as any).Kakao = {
      init: jest.fn(),
      isInitialized: jest.fn().mockReturnValue(false),
      Auth: {
        authorize: jest.fn(),
      },
    };

    mockedUseAuthStore.mockReturnValue({
      setToken: jest.fn(),
      setUser: jest.fn(),
      token: null,
      user: null,
    });
  });

  it("initializes Kakao SDK if not already initialized", async () => {
    renderHookWithRouter(useKakaoLogin);
    expect(window.Kakao.init).toHaveBeenCalledWith(expect.any(String));
    expect(window.Kakao.isInitialized).toHaveBeenCalled();
  });

  it("handles successful Kakao login redirect with auth code", async () => {
    const code = "some-auth-code";
    window.history.pushState({}, "Test page", `/test?code=${code}`);

    const mockSetToken = jest.fn();
    const mockSetUser = jest.fn();
    mockedUseAuthStore.mockReturnValue({
      setToken: mockSetToken,
      setUser: mockSetUser,
      token: null,
      user: null,
    });

    mockedClient.post.mockResolvedValue({
      data: {
        ok: 1,
        item: {
          token: {
            accessToken: "test-token",
            refreshToken: "test-refresh-token",
          },
          user: { id: 1, name: "Test User" },
        },
      },
    });

    const { result } = renderHookWithRouter(useKakaoLogin);

    await act(async () => {
      const handleLogin = result.current as () => Promise<void>;
      await handleLogin();
    });

    expect(mockSetToken).toHaveBeenCalledWith("test-token");
    expect(mockSetUser).toHaveBeenCalledWith({
      id: 1,
      name: "Test User",
    });
    expect(window.location.pathname).toBe("/"); // Assumes navigation to home on success
  });
});
