// src/types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string; // SupabaseのユーザーID
  }
  interface Session {
    user: {
      id: string; // ユーザーID
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
