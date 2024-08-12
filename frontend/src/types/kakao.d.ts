interface KakaoStatic {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Auth: {
    authorize: (options: {
      redirectUri: string;
      scope?: string;
      state?: string;
      throughTalk?: boolean;
    }) => void;
  };
}

interface Window {
  Kakao: KakaoStatic;
}
