// import { error } from 'console';
import { NextResponse } from 'next/server'
import OpenAI from 'openai';

const openai = new OpenAI({
    baseURL: process.env.OPENAI_API_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  const { text, language } = await request.json();
  
  console.log(text, language)
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          "role": "system",
          "content": `
          # 役割  
          あなたは入力された文章を翻訳する翻訳アシスタントです。
          あなたは英語と日本語のネイティブスピーカーです。
  
          # タスク
          - 入力された文章を${language}に変換します。
          - 入力された文章をネイティブにとって自然な意味になるように変換します。
          - 翻訳後の文章は${language}の言語のみで作成してください。
          - 翻訳した文章以外は返さないでください。
          - 以降は入力された文章を翻訳してください。
          `
        },
        {
          "role": "user",
          "content": `翻訳してください: ${text}`,
        }
      ],
      temperature: 0.7,
      max_tokens: 64,
      top_p: 1,
    });

    const translatedText = response.choices[0]?.message?.content || "翻訳に失敗しました。";
    return NextResponse.json({ text: translatedText });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Failed to translate." });
  }
}