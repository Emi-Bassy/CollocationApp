"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { handleSpeak } from "@/utils/speech";
import Image from "next/image";

type AnswerData = {
    text: string
}

const QuizPage = () => {
  const searchParams = useSearchParams();
  const question = searchParams.get("question"); // クイズ文（日本語）
  const answer = searchParams.get("answer"); // ユーザの回答

  const [isRecording, setIsRecording] = useState(false); // 録音状態
  const [spokenText, setSpokenText] = useState<string>(""); // 音声認識結果
  const [translation, setTranslation] = useState<string>(""); // 翻訳結果
  const [questionTranslation, setQuestionTranslation] = useState<string>(""); // 問題文の英訳
  const [similarity, setSimilarity] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [error, setError] = useState<string | null>(null); // エラーメッセージ
  const [hint, setHint] = useState<string | null>(null); // ヒント内容
  const [showHint, setShowHint] = useState<boolean>(false); 
  const [isAnswerButtonClicked, setIsAnswerButtonClicked] = useState(false);

  // 音声認識で回答を取得
  const handleOnRecord = () => {
    if (isRecording) {
      setIsRecording(false); // 録音を停止
      console.log("Recording stopped");
      return;
    }

    console.log("Recording started");
    setIsRecording(true);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // 音声入力の言語設定

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript; // 認識されたテキスト
      console.log("Recognized text:", transcript);
      setSpokenText(transcript);

      // 翻訳APIにリクエストを送信
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: transcript, language: "ja-JP" }),
        });
        const data = await response.json();
        setTranslation(data.text); // 翻訳結果を保存
      } catch (error) {
        console.error("Translation failed:", error);
      }
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      setIsRecording(false);
    };

    recognition.start();
  };

  // 問題文を英訳する関数
  const handleFetchTranslation = async () => {
    if (!question) {
      setError("Question is missing.");
      return;
    }
  
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: question,
          language: "en",
        }),
      });
      const data:AnswerData = await response.json();
      setQuestionTranslation(data.text); // 英訳結果を保存
      return data.text; // 翻訳結果を返す
    } catch (error) {
      console.error("Error fetching translation:", error);
      setError("Translation failed.");
    }
  };

  // ヒントを取得する関数
  const handleFetchHint = async () => {
    if (!question || !answer) {
      setError("Question or answer is missing.");
      return;
    }
    setError(null); // エラーのリセット
    const translation = await handleFetchTranslation(); // 問題文の翻訳を取得
    console.log(translation);
    if (translation) {
        // 正解の英文をランダムに並び替え
        const words = translation.split(" ");
        const shuffledWords = words
        .map((word): { word: string; sort: number } => ({ word, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ word }: { word: string }) => word);
        
        const shuffledHint = shuffledWords.join(" ");
        setHint(shuffledHint); // ヒントを保存
        setShowHint(true); // ヒントを表示
    }
  };
  
  const handleShowAnswer = async () => {
    if (!questionTranslation) {
        await handleFetchTranslation(); // 显示される前に翻訳を取得
    }
    setError(null); // エラーをリセット

    setIsAnswerButtonClicked(true); // 正答の確認

    try {
        // ユーザ回答と正解のログを表示
        console.log("User Answer:", spokenText);
        console.log("Correct Answer (Translation):", answer);
        // 類似度判定
        if (spokenText) {
            const similarityResponse = await fetch("/api/quizFeedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userAnswer: spokenText,
                    correctAnswer: answer,
                }),
            });

            if (!similarityResponse.ok) {
                throw new Error("Failed to fetch similarity.");
            }

            const similarityData = await similarityResponse.json();

            console.log("Similarity Response (Raw):", similarityResponse);
            console.log("Similarity Data (Parsed):", similarityData);

            // if (similarityData.error || typeof similarityData.similarity !== "number") {
            //     throw new Error("Similarity response is invalid.");
            // }
            setSimilarity(similarityData.similarity);
        } else {
            setFeedback("No answer provided. Please speak your answer first.");
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setError("An unexpected error occurred.");
      }
    };

  if (!question || !answer) {
    return <p>Loading...</p>; // クイズデータがロード中の場合
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Quiz</h1>
  
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* ローディング状態を考慮した条件付きレンダリング */}
          {!question || !answer ? (
            <div className="text-center py-6">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="text-lg font-medium text-gray-700">Question:</p>
                <div className="flex items-center gap-6">
                  <p className="mt-1 text-gray-600">{question}</p>
                  <button 
                      onClick={handleFetchHint} 
                      className="px-4 py-1 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded">
                      {showHint ? "Sorting!" : "Show Hint"}
                  </button>
                </div>
              </div>
              {showHint && hint && (
                <div className="mt-2 text-gray-600">
                    <p className="text-sm italic">Hint: {hint}</p>
                </div>
              )}
  
              <div className="border-b pb-4">
                <p className="text-lg font-medium text-gray-700">Practice Collocation:</p>
                <p className="mt-1 text-gray-600">{answer}</p>
              </div>
  
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleOnRecord}
                  className={`px-6 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-zinc-900 hover:bg-zinc-800 text-zinc-100"
                  }`}
                >
                  {isRecording ? "Stop" : "Start Recording"}
                </button>

                <button
                    onClick={handleShowAnswer}
                    className="px-6 py-2 rounded-md text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Check the answer
                </button>
              </div>
  
              <div className="pt-4 space-y-3">
                <div>
                  <p className="text-lg font-medium text-gray-700">Spoken Text:</p>
                  <p className="mt-1 text-gray-600">{spokenText || "No input detected yet."}</p>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700">Translation:</p>
                  <p className="mt-1 text-gray-600">{translation || "Translation will appear here."}</p>
                </div>
                {isAnswerButtonClicked && (
                    <div>
                        <p className="text-lg font-medium text-gray-700">Question Translation:</p>
                        <div className="flex items-center gap-6">
                          <p className="mt-1 text-gray-600">{questionTranslation}</p>
                          <button
                              onClick={() => handleSpeak(questionTranslation)} // コロケーションの読み上げ
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                              >
                              <Image
                                  src="/microphone.svg"
                                  alt="Speak"
                                  width={100}
                                  height={100}
                                  className="w-4 h-4"
                              />
                          </button>
                        </div>
                    </div>
                )}
              </div>
              {error && (
                <div className="mt-4 text-red-500">
                    <p>Error: {error}</p>
                </div>
              )}
              {similarity !== null && (
              <div className="mt-6">
                <p className="text-lg font-medium text-gray-700">Feedback:</p>
                <p className="mt-1 text-gray-600">{feedback}</p>
                <p className="mt-1 text-gray-500">類似度: {similarity}%</p>
              </div>
            )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;