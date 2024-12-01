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
    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // Supabase テーブルにユーザーを挿入
    const { error } = await supabase
      .from("app_user")
      .insert([{ username, password: hashedPassword }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "User signed up successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "An error occurred during sign up" }, { status: 500 });
  }
}
