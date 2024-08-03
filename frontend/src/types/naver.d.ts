// naver.d.ts
interface NaverLoginUser {
  email: string;
  name: string;
  id: string;
}

interface NaverLogin {
  init: () => void;
  getLoginStatus: (callback: (status: boolean) => void) => void;
  logout: () => void;
  authorize: () => void;
  user: NaverLoginUser;
}

interface NaverLoginWithNaverId {
  new (options: {
    clientId: string;
    callbackUrl: string;
    isPopup: boolean;
    callbackHandle?: boolean;
    loginButton?: { color: string; type: number; height: number };
    state?: string;
  }): NaverLogin;
}

interface NaverStatic {
  LoginWithNaverId: NaverLoginWithNaverId;
}

interface Window {
  naver: NaverStatic;
}
