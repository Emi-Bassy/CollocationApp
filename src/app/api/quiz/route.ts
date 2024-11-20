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
        
        #ルール
        - 問題である文章のみ表示する
        - 英単語で10単語程度で作成できる文章を作成する
        - 英語能力が初級の人が知っている言葉を使う
        - 不要な文章は表示しない
        - 不要な句読点は表示しない
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
