"use client"

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { CollocationResult } from "@/app/lib/types";
import { relationMap } from "@/app/lib/types";
import { supabase } from '@/app/lib/supabaseClient';

interface DetailViewProps {
  result: CollocationResult;
  onClose: () => void;
}

export function DetailView({ result, onClose }: DetailViewProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [translateExample, setTranslateExample] = useState<string[]>([]);
  const relationInfo = relationMap[result.relation];

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

  const fetchTranslations = async () => {
    const fetchTranslations = await Promise.all(
      result.examples.map(async (example) => {
        const response = await fetch("api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: example, language: "ja"}),
        });

        const data = await response.json();
        return data.text;
      })
    );
    setTranslateExample(fetchTranslations);
  }

  // 初回レンダリング時に翻訳を取得
  useEffect(() => {
    fetchTranslations();
  }, []);

  return (
      <div className="text-black p-6 bg-white rounded-lg shadow-lg border">
        <button
          onClick={onClose}
          className="mb-4 px-3 py-1 bg-gray-300 text-white rounded hover:bg-red-600"
        >
          Close
        </button>
        <h2 className="text-2xl font-bold mb-4">{result.collocation}</h2>
        <div className="mb-4">
          <p className="font-medium text-gray-700">Relation: {result.relation}</p>
          {relationInfo && (
            <div className="mt-2 text-gray-600">
              <p className="text-sm">{relationInfo.description}</p>
              <p
                  className="text-sm"
                  dangerouslySetInnerHTML={{
                    __html: sanitizedExample(relationInfo.example),
                  }}
              />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Example Sentences</h3>
          <ul className="list-disc pl-5 space-y-2">
            {result.examples.map((example, index) => (
            <li key={index} className="text-gray-800">
              <p dangerouslySetInnerHTML={{ __html: sanitizedExample(example) }} />
              {translateExample[index] && (
                <p dangerouslySetInnerHTML={{ __html: sanitizedExample(translateExample[index]) }} />
              )}
            </li>
          ))}
          </ul>
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