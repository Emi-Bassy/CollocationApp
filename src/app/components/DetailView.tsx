"use client"

import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CollocationResult } from "@/app/lib/types";
import { relationMap } from "@/app/lib/types";
import { handleSpeak } from "@/utils/speech";
import { supabase } from '@/app/lib/supabaseClient';
import Image from 'next/image';

interface DetailViewProps {
  result: CollocationResult;
  onClose: () => void;
}

export function DetailView({ result, onClose }: DetailViewProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [exampleTranslation, setExampleTranlation] = useState<string[]>([]);
  const [collocationTranslation, setCollocationTranlation] = useState<string[]>([]);
  const relationInfo = relationMap[result.relation];
  const router = useRouter();

  const sanitizedExample = (html: string) =>
    DOMPurify.sanitize(html);

  const addToProgress = async () => {
    setLoading(true);
    setMessage(null);

    // コロケーションをデータベースに保存
    const { error } = await supabase.from('progress').insert([
      {
        collocation: result.collocation,
        relation: result.relation,
        examples: result.examples,
      },
    ]);
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Collocation added to progress successfully!");
    }
    setLoading(false);
  };

  // コロケーションの翻訳
  const fetchTranslations = async () => {
    try {
      // コロケーションの和訳を取得
      const collocationResponse = await fetch("api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: result.collocation, language: "ja" }),
    });
    const collocationData = await collocationResponse.json();
    setCollocationTranlation(collocationData.text);


    // 例文の和訳を取得
      const exampleResponse = await Promise.all(
        result.examples.map(async (example) => {
          const response = await fetch("api/translate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: example, language: "ja" }),
          });
          const data = await response.json();
          return data.text;
        })
      );
      setExampleTranlation(exampleResponse);
    } catch (error) {
      console.error("Error fetching translations:", error);
    }
  };

  // 初回レンダリング時に翻訳を取得
  useEffect(() => {
    fetchTranslations();
  }, []);

  // クイズの作成
  const handleQuiz = async () => {
    const response = await fetch("api/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collocation: result.collocation,
      }),
    });

    const quizData = await response.json();

    // /quizページに遷移してクイズデータを渡す
    router.push(`/quiz?question=${encodeURIComponent(quizData.question)}&answer=${encodeURIComponent(quizData.answer)}`);
  };

  return (
      <div className="text-black max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <button
          onClick={onClose}
          className="mb-4 px-3 py-1 bg-gray-300 text-white rounded hover:bg-red-600"
        >
          Close
        </button>
        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-bold">{result.collocation}</h2>
          <button
            onClick={() => handleSpeak(result.collocation)} // コロケーションの読み上げ
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 ml-2" // ml-2で左側にマージンを追加
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
        <p className="text-gray-700 mb-6">{collocationTranslation}</p>
        <div className="mb-4">
          <p className="font-medium text-gray-700">Relation: {result.relation}</p>
          {relationInfo && (
            <div className="mt-2 text-gray-600">
              <p className="text-sm">{relationInfo.description}</p>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Example Sentences</h3>
          <ul className="list-disc pl-5 space-y-2">
            {result.examples.map((example, index) => (
            <li key={index} className="text-gray-800">
              <p dangerouslySetInnerHTML={{ __html: sanitizedExample(example) }} />
              {exampleTranslation[index] && (
                <p dangerouslySetInnerHTML={{ __html: sanitizedExample(exampleTranslation[index]) }} />
              )}
            </li>
          ))}
          </ul>
          <button
            onClick={handleQuiz}
            className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
          >
            Quiz
          </button>
        </div>
        <button
          onClick={addToProgress}
          className={`mt-4 px-4 py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add"}
        </button>
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
    );
  }