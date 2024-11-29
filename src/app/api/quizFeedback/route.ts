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
          あなたは言語評価者です。あなたの任務は、2つの英語の文がどれほど似ているかを0から100のスケールで評価し、以下の基準に従ってフィードバックメッセージを生成してください。
          
          - 80以上100以下: Excellent!
          - 60以上80未満: Great job!
          - 40以上60未満: Good effort!
          - 20以上40未満: Good try! Keep it up!
          - 0以上20未満: Keep trying!
          
          - 類似性のパーセンテージを数値として出力し、その後に評価メッセージを返してください。
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
      max_tokens: 150,
    });

    const content = response.choices[0]?.message?.content || "";
    const [similarityScoreString, feedbackMessage] = content.split("\n").map(line => line.trim());
    const similarityScore = parseFloat(similarityScoreString) || 0;
    
    return NextResponse.json({ 
      similarity: similarityScore,
      feedback: feedbackMessage || "評価理由が提供されていません。"
    });
  } catch (error) {
    console.error("Error calculating similarity:", error);
    return NextResponse.json({ error: "Failed to calculate similarity" });
  }
}