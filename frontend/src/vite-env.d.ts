/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADDRESS_PACKAGE: string;
  readonly VITE_ADDRESS_ADMIN: string;
  readonly VITE_NETWORK: string;
  readonly VITE_CLOCK_ADDRESS: string;
  readonly VITE_BACKEND_URL: string;
  readonly VITE_UPDATE_URL: string;
  readonly VITE_PINATA_API_KEY: string;
  readonly VITE_SECRET_PINATA_API_KEY: string;
  readonly VITE_IPFS_GATEWAY: string;
  readonly VITE_CLIENT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
