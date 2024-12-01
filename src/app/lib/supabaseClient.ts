import { createClient } from '@supabase/supabase-js';
import { getSession } from "next-auth/react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Progressデータを取得
export async function fetchProgress() {
  const session = await getSession();
  if (!session || !session.user?.id) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", session.user.id); // ユーザーIDで絞り込み

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Completeデータを追加
export async function addToComplete(collocation: string, relation: string, examples: string[]) {
  const session = await getSession();
  if (!session || !session.user?.id) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("completed")
    .insert([
      {
        collocation,
        relation,
        examples,
        user_id: session.user.id, // 現在のユーザーIDをセット
      },
    ]);

  if (error) {
    throw new Error(error.message);
  }
}
