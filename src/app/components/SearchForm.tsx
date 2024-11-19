"use client";

import { useState, FormEvent } from "react";
import { createClient } from "@supabase/supabase-js";
import { SearchResults } from "./SearchResults";
import { DetailView } from "./DetailView";
import { fetchCollocations } from "@/app/api/collocation/route";
import { CollocationResult } from "@/app/lib/types";

// Supabase のクライアントを初期化
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SearchForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<CollocationResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<CollocationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // コロケーションの検索
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError("");

    const response = await fetchCollocations(searchTerm.trim());

    if (response.error) {
      setError(response.error);
      setResults([]);
    } else if (response.collocations.length === 0) {
      setError("No collocations found. Try a different word.");
      setResults([]);
    } else {
      setResults(response.collocations);
    }

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">Collocation Dictionary</h1>
      {!selectedResult ? (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="search" className="text-white text-sm font-medium text-gray-700">
                Enter a word to find its collocations
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter a word"
                className="text-black w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? "Searching..." : "Find Collocations"}
            </button>
          </form>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-center">{error}</p>
            </div>
          )}

          {results.length > 0 && (
            <SearchResults results={results} onResultClick={setSelectedResult}/>
          )}
        </>
      ) : (
        <DetailView result={selectedResult} onClose={() => setSelectedResult(null)} />
      )}
    </div>
  );
}