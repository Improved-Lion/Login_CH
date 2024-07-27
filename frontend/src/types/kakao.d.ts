// src/types/kakao.d.ts
interface KakaoSDK {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Auth: {
    authorize: (options: { redirectUri: string; scope?: string }) => void;
  };
}

interface Window {
  Kakao: KakaoSDK;
}
