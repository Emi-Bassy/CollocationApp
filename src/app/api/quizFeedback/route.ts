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
          あなたは言語評価者です。あなたの任務は、2つの英語の文がどれほど似ているかを評価し、以下の基準に従ってフィードバックを提供してください。

          # 基準
          - 80以上100以下: "Excellent!" (英語)
          - 60以上80未満: "Great job!" (英語)
          - 40以上60未満: "Good effort!" (英語)
          - 20以上40未満: "Good try! Keep it up!" (英語)
          - 0以上20未満: "Keep trying!" (英語)

          # 出力
          - 1行目に短文（英語）を出力してください。
          - 2行目に日本語で評価の理由を説明してください。
          - 出力の例:
            Excellent!
            文法、スペル、意味が完全に一致しています。
          `,
        },
        {
          role: "user",
          content: `以下の2つの文を比較してください:
          1. ${userAnswer}
          2. ${correctAnswer}`,
        },
      ],
      temperature: 0,
      max_tokens: 150,
    });

    const content = response.choices[0]?.message?.content || "";
    const [shortFeedback, reason] = content.split("\n").map((line) => line.trim());

    return NextResponse.json({
      feedback: shortFeedback || "No feedback available.",
      reason: reason || "理由が提供されていません。",
    });
  } catch (error) {
    console.error("Error calculating feedback:", error);
    return NextResponse.json({ error: "Failed to calculate feedback" });
  }
}
