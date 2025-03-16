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
          あなたは言語学習者向けのクイズ作成アシスタントです。以下の条件を厳密に守り、クイズの問題文を作成してください。

          # 指示
          - 必ず指定されたコロケーション${collocation}を**そのままの形で**使用してください。
          - コロケーションの語順や単語の変更を**絶対に行わないでください**。
          - 問題文では${collocation}を**和訳して**用いてください。
          - 問題文は全て日本語で表記してください。
          - コロケーションは、文中で自然な形で含める必要があります。
          - コロケーションが置き換えられたり、同義表現に変換されないようにしてください。
          - 問題文は日本語で作成してください。問題文に英語を含めないでください。
          - 小学生でも理解できる簡単で短い文章を作成してください。
          - 問題文は一文で構成してください。二文以上に分割しないでください。
          - 難しい語彙や表現を避け、初級者でもわかる平易な言葉を使ってください。
          - 文法的に正しく、自然でわかりやすい文章を作成してください。
          - クイズ文は一目で理解できるシンプルな構造にしてください。
          - 不必要な句読点や記号を避け、簡潔に書いてください。

          # 制約
          - 指定されたコロケーション${collocation}を中心に文章を構築してください。
          - 日本語の文中に英単語が含まれる場合でも、自然に翻訳された形で問題文に反映してください。
          - 子どもでも理解できるシンプルで日常的な場面を想定した文章を作成してください。

          # 例
          - コロケーション: "sound sleep"
            作成される問題文: ぐっすり眠ったのでとても気分が良くなりました。
            英訳: A sound sleep made me feel much better. (8語)

          # 注意
          - 作成したクイズ文が指定されたコロケーション${collocation}を正確に使用しているか確認してください。
        `,
      },
      {
        role: "user",
        content: `コロケーション「${collocation}」を使って日本語のクイズ文を作成してください。`,
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
