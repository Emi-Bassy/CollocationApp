import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.OPENAI_API_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { collocation } = await request.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
        あなたは言語学習者向けのクイズ作成アシスタントです。
        指定されたコロケーションを使って日本語のクイズ文を作成してください。

        #手順
        1 ${collocation}を使った英文を作成する
        2 作成された英文を日本語に翻訳する
        3 作成した日本語が、日本語のネイティブにとって不自然な表現を使用していないか確認する
        4 作成した英文が #ルール を全て守っているか確認する
        
        #ルール
        - 問題文は必ず${collocation}を使った文章を作成する
        - ${collocation}と同義の別の表現を使用していた場合は、必ず${collocation}を使用するよう変更する
        - 問題である文章のみ表示する
        - 英単語で必ず10単語以下で表現できる文章を作成する
        - 英語能力が初級の人が知っている言葉を使う
        - 小学生でも理解できる簡単な文章を作成する
        - 問題文は一文で完結する文章を作成する
        - 問題文には会話を行わない
        - 問題文に英語は使用しない
        - 不要な文章は表示しない
        - 不要な句読点は表示しない
        - 文章全文を作成する
        `,
      },
      {
        role: "user",
        content: `コロケーション「${collocation}」を使って、日本語のクイズ文を作成してください。`,
      },
    ],
    temperature: 0.7,
    max_tokens: 64,
  });

  const quizQuestion = response.choices[0]?.message?.content || "クイズの生成に失敗しました";

  return NextResponse.json({
    question: quizQuestion,
    answer: collocation,
  });
}
