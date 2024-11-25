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
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
          # 役割  
          あなたは英語のネイティブの立場で、英文の類似度を判定します。

          # タスク
          - ${userAnswer}と${correctAnswer}ががどのくらい似ているのか、100%を上限として教えてください。
          - 類似度の結果以外は返さないでください。
          - 以降は入力された英文の類似度を判定してください。
          `,
        },
        {
          role: "user",
          content: `User Answer: ${userAnswer}\nCorrect Answer: ${correctAnswer}`,
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
