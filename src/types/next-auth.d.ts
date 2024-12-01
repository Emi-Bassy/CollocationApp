// src/types/next-auth.d.ts
import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string; // SupabaseのユーザーID
  }
  interface Session extends DefaultSession {
    user: {
      id: string; // ユーザーID
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
