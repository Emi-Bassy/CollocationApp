import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.OPENAI_API_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { question, collocation } = await request.json();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            あなたは言語学習者向けのクイズアシスタントです。
            クイズの問題文と指定されたコロケーションに基づいてヒントを生成してください。

            #ルール
            - ヒントには必ず「${collocation}」が含まれる必要があります。
            - コロケーションを活用し、問題文を理解する助けになる1文の説明を作成してください。
            - ${collocation}を使わないヒントを生成しないでください。
            - ヒントは学習者にわかりやすいシンプルな言葉を用いてください。
          `,
        },
        {
          role: "user",
          content: `問題文: "${question}" に基づいてヒントを作成してください。`,
        },
      ],
      temperature: 0.7,
      max_tokens: 50,
    });

    const hint = response.choices[0]?.message?.content || "ヒントの生成に失敗しました。";
    return NextResponse.json({ hint });
  } catch (error) {
    console.error("Error generating hint:", error);
    return NextResponse.json({ error: "Failed to generate hint." });
  }
}
