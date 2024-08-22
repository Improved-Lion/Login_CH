interface FacebookLoginStatusResponse {
  status: "connected" | "not_authorized" | "unknown";
  authResponse: {
    accessToken: string;
    expiresIn: string;
    signedRequest: string;
    userID: string;
  } | null;
}

interface FacebookLoginOptions {
  scope: string;
}

interface FacebookSDK {
  init(options: {
    appId: string;
    cookie?: boolean;
    xfbml?: boolean;
    version: string;
  }): void;
  login(
    callback: (response: FacebookLoginStatusResponse) => void,
    options?: FacebookLoginOptions
  ): void;
  getLoginStatus(
    callback: (response: FacebookLoginStatusResponse) => void
  ): void;
  api(path: string, callback: (response: any) => void): void;
  // AppEvents 속성 추가 (필요한 경우)
  AppEvents?: {
    logPageView: () => void;
  };
}

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: FacebookSDK;
  }

  const FB: FacebookSDK;
}

export {};
