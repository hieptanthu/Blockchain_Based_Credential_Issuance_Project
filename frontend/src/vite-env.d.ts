/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADDRESS_PACKAGE: string;
  readonly VITE_ADDRESS_ADMIN: string;
  readonly VITE_NETWORK: string;
  readonly VITE_CLOCK_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
