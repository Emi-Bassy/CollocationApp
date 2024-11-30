import { createClient } from "@supabase/supabase-js";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Supabaseクライアントのセットアップ
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const username = credentials?.username;
        const password = credentials?.password;

        if (!username || !password) {
            console.error("Missing credentials");
            return null;
        }

        try {
          // Supabaseでユーザー情報を取得
          const { data: user, error } = await supabase
            .from("app_user")
            .select("*")
            .eq("username", username)
            .eq("password", password) // パスワードを直接比較
            .single();

          if (error) {
            console.error("Supabase error:", error.message);
            return null;
          }

          if (user) {
            console.log("User found:", user); // デバッグログ
            return { id: user.id, name: user.username }; // ログイン成功
          } else {
            console.error("Invalid credentials");
            return null; // ユーザーが見つからない場合
          }
        } catch (err) {
          console.error("Error in authorize method:", err);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login",
  },
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
