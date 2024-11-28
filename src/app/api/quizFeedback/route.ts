import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.OPENAI_API_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { userAnswer, correctAnswer } = await request.json();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `
          あなたは言語評価者です。あなたの任務は、2つの英語の文がどれほど似ているかを0%から100%のスケールで評価することです。
          
          - 類似性のパーセンテージは数値(例:85)として提供してください。
          - 上記の評価した理由を日本語で教えてください
          - 類似性を判断する際には、スペル、文法、および意味を考慮してください。
          - 両方の文が同一であれば、100を返してください。
          - 文に類似性が全くない場合は、0を返してください。
          `,
        },
        {
          role: "user",
          content: `2つの値を比較してください:
          1. ${userAnswer}
          2. ${correctAnswer}`,
        },
      ],
      temperature: 0,
      max_tokens: 10,
    });

    const similarityScore = response.choices[0]?.message?.content || "0";
    return NextResponse.json({ similarity: parseFloat(similarityScore) });
  } catch (error) {
    console.error("Error calculating similarity:", error);
    return NextResponse.json({ error: "Failed to calculate similarity" });
  }
}
