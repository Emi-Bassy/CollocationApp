import NextAuth, { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import CredentialsProvider from "next-auth/providers/credentials";

interface Credentials {
  username: string;
  password: string;
}

interface CustomUser {
  id: string;
  name: string | null;
}

// Supabaseクライアントのセットアップ
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          console.error("Missing credentials");
          return null;
        }

        const { username, password } = credentials as Credentials;

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
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
        if (token.sub) {
          (session.user as CustomUser).id = token.sub; 
        }
        return session;
      }
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login",
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
