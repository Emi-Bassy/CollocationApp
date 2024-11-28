"use client";

import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { relationMap } from "@/app/lib/types";
import { handleSpeak } from "@/utils/speech";
import { supabase } from "@/app/lib/supabaseClient";

export default function DetailPage() {
  const router = useRouter();
  const collocationParams = useSearchParams();
  const searchCollocation = collocationParams.get("collocation");
  const searchRelation = collocationParams.get("relation");
  const searchExample = collocationParams.get("example");
  const searchedEXample = JSON.parse(searchExample || "[]") as string[];

  const [exampleTranslation, setExampleTranslation] = useState<string[]>([]);
  const [collocationTranslation, setCollocationTranslation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const sanitizedExample = (html: string) => DOMPurify.sanitize(html);

  const fetchTranslations = async () => {
    try {
      // コロケーションの和訳を取得
      const collocationResponse = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: searchCollocation, language: "ja" }),
      });

      // レスポンスが OK でなければエラーを投げる
      if (!collocationResponse.ok) {
        throw new Error(`Error: ${collocationResponse.status}`);
      }

      const collocationData = await collocationResponse.json();
      setCollocationTranslation(collocationData.text);

      // 例文の和訳を取得
      const exampleResponse = await Promise.all(
        searchedEXample.map(async (example) => {
          const response = await fetch("/api/translate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: example, language: "ja" }),
          });

          // レスポンスが OK でなければエラーを投げる
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          const data = await response.json();
          return DOMPurify.sanitize(data.text); // サニタイザーを適用
        })
      );
      setExampleTranslation(exampleResponse);
     } catch (error) {
       console.error("Error fetching translations:", error);
    }
  };

  useEffect(() => {
    fetchTranslations();
  },[]);

  const addToProgress = async () => {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.from("progress").insert([
      {
        collocation: searchCollocation,
        relation: searchRelation,
        examples: searchedEXample,
      },
    ]);
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Collocation added to progress successfully!");
    }
    setLoading(false);
  };

  const handleQuiz = async () => {
    const response = await fetch("/api/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collocation: searchCollocation,
      }),
    });
    const quizData = await response.json();
    router.push(`/quiz?question=${encodeURIComponent(quizData.question)}&answer=${encodeURIComponent(quizData.answer)}`);
  };

  return (
    <div className="min-h-screen bg-black text-black p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <button
            onClick={() => router.back()}
            className="mb-4 px-3 py-1 bg-gray-300 text-white rounded hover:bg-red-600"
        >
            Close
        </button>
        <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold mb-4">{searchCollocation}</h1>
            <button
                onClick={() => handleSpeak(searchCollocation || "")}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
            >
                <img src="/microphone.svg" alt="Speak" className="w-4 h-4" />
            </button>
        </div>
        <p className="text-gray-700 mb-6">{collocationTranslation}</p>
        <p className="font-medium text-gray-700">Relation: {searchRelation}</p>
        {relationMap[searchRelation || ""] ? (
            <div className="mt-2 text-gray-600">
            <p className="text-sm">{relationMap[searchRelation || ""]?.description}</p>
            </div>
        ) : (
            <p className="text-sm text-red-500">No description available</p>
        )}
        <div className="mt-4">
            <h2 className="text-lg font-semibold">Example Sentences</h2>
            <ul className="list-disc pl-6">
            {searchedEXample.map((example, index) => (
                <li key={index} className="text-gray-800">
                <p dangerouslySetInnerHTML={{ __html: sanitizedExample(example) }} />
                {exampleTranslation[index] && (
                    <p dangerouslySetInnerHTML={{ __html: sanitizedExample(exampleTranslation[index]) }} />
                )}
                </li>
            ))}
            </ul>
        </div>
        <div className="flex flex-col">
            <button
                onClick={handleQuiz}
                className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
            >
                Quiz
            </button>
            <button
                onClick={addToProgress}
                className={`mt-4 px-4 py-2 rounded text-green-500 border border-green-500 ${
                    loading ? "bg-gray-400" : "bg-white hover:bg-gray-100"
                }`}
                disabled={loading}
            >
                {loading ? "Adding..." : "Add to Progress"}
            </button>
        </div>
        
        {message && (
            <p
            className={`mt-4 text-center ${
                message.startsWith("Error") ? "text-red-600" : "text-green-600"
            }`}
            >
            {message}
            </p>
        )}
      </div>
    </div>
  );
}
