import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.OPENAI_API_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { question } = await request.json();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            あなたは言語学習者向けのクイズアシスタントです。
            クイズ文に基づいて簡単なヒントを作成してください。
            ヒントは以下の条件に従うものとします。
            - クイズの答えを直接記載しない。
            - クイズ文を理解するのに役立つ説明や背景を1文で提供する。
          `,
        },
        {
          role: "user",
          content: `Provide a hint for this quiz question: "${question}"`,
        },
      ],
      temperature: 0.7,
      max_tokens: 50,
    });

    const hint = response.choices[0]?.message?.content || "Hint generation failed.";
    return NextResponse.json({ hint });
  } catch (error) {
    console.error("Error generating hint:", error);
    return NextResponse.json({ error: "Failed to generate hint." });
  }
}
