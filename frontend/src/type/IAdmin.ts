// src/sui.d.ts

declare module "@mysten/sui.js" {
  interface adminResponse {
    content: {
      fields: {
        admins: {
          fields: {
            contents: string[];
          };
        };
        codes_bytes: {
          fields: {
            contents: string[];
          };
        };
        id: {
          id: string;
        };
        super_admin: string;
      };
    };
  }
}
