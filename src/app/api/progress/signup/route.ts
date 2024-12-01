import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

// Supabase クライアントのセットアップ
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
  }

  try {
    // ユーザー名の重複チェック
    const { data: existingUser, error: fetchError } = await supabase
      .from("app_user")
      .select("id")
      .eq("username", username)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists. Please choose a different username." },
        { status: 409 }
      );
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // 新しいユーザーを挿入
    const insertResult = await supabase
      .from("app_user")
      .insert([{ username, password: hashedPassword }]);

    if (insertResult.error) {
      return NextResponse.json({ error: insertResult.error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "User signed up successfully" }, { status: 200 });
  } catch (error) {
    console.error("Sign-up error:", error); // エラーをログに記録
    return NextResponse.json({ error: "An error occurred during sign up" }, { status: 500 });
  }
}
