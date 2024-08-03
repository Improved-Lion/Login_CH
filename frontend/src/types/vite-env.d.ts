/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KAKAO_APP_KEY: string;
  readonly VITE_REDIRECT_URL: string;
  readonly VITE_NAVER_CLIENT_ID: string;
  readonly VITE_NAVER_CLIENT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
