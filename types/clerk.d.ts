// types/clerk.d.ts  (make sure it's covered by "include" in tsconfig.json)
export {};

declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: (options?: { template?: string }) => Promise<string | null>;
      } | null;
    };
  }
}