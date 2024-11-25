"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { text } from "stream/consumers";
import { error } from "console";

const QuizPage = () => {
  const searchParams = useSearchParams();
  const question = searchParams.get("question"); // クイズ文（日本語）
  const answer = searchParams.get("answer"); // 正解（コロケーション）

  const [isRecording, setIsRecording] = useState(false); // 録音状態
  const [spokenText, setSpokenText] = useState<string>(""); // 音声認識結果
  const [translation, setTranslation] = useState<string>(""); // 翻訳結果
  const [questionTranslation, setQuestionTranslation] = useState<string>(""); // 問題文の英訳

  const [similarity, setSimilarity] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [error, setError] = useState<string | null>(null); // エラーメッセージ


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

  const handleShowAnswer = async () => {
    if (!question || !answer) {
        setError("Question or answer is missing.");
        return;
    }
    setError(null); // エラーをリセット

    
    try {
        // 問題文を英訳
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `日本語のクイズ文「${question}」に基づき、選択されたコロケーション「${answer}」を使った英訳を作成してください。`,
            language: "en",
          }),
        });
        const data = await response.json();
        setQuestionTranslation(data.text); // 英訳結果を保存

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

            if (similarityData.error || typeof similarityData.similarity !== "number") {
                throw new Error("Similarity response is invalid.");
            }

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

  // コロケーションの読み上げ
  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(questionTranslation);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
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
                <p className="mt-1 text-gray-600">{question}</p>
              </div>
  
              <div className="border-b pb-4">
                <p className="text-lg font-medium text-gray-700">Practice Collocation:</p>
                <p className="mt-1 text-gray-600">{answer}</p>
              </div>
  
              <div className="flex justify-center py-4">
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
                    答えを確認
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
                {questionTranslation && (
                    <div>
                        <p className="text-lg font-medium text-gray-700">Question Translation:</p>
                        <p className="mt-1 text-gray-600">{questionTranslation}</p>
                        <button
                            onClick={handleSpeak}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                            >
                            <img
                                src="/microphone.svg"
                                alt="Speak"
                                className="w-4 h-4"
                            />
                        </button>
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