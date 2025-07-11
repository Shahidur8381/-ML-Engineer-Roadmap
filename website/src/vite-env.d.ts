/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_TOKEN: string
  readonly VITE_GIST_ID: string
  readonly VITE_DEV_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
