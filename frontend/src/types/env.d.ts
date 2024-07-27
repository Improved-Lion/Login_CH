/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KAKAO_APP_KEY: string;
  readonly VITE_REDIRECT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}