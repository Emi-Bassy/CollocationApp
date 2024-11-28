
import { CollocationResult } from "@/app/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResultsProps {
  results: CollocationResult[];
  onResultClick: (result: CollocationResult) => void;
}

export function SearchResults({ results, onResultClick }: SearchResultsProps) {
  const sortedResults = [...results].sort((a, b) => b.frequency - a.frequency);
  const router = useRouter();
  return (
    <div className="test-black bg-white p-6 rounded-lg shadow-lg border">
      <div className="test-black mb-6">
        <h2 className="text-black text-xl font-semibold mb-2">Search Results</h2>
        <p className="text-gray-600">Click a collocation for more details</p>
      </div>

      <div className="test-black grid grid-cols-2 md:grid-cols-3 gap-4">
        {sortedResults.map((result, index) => (
          <Link
            key={result.id}
            href ={{
              pathname: `/detail/${result.collocation}`, // URL
              query: {collocation: result.collocation, relation: result.relation, example: JSON.stringify(result.examples)} // 検索クエリ
            }}
            className="test-black p-3 bg-gray-100 rounded-lg text-center hover:bg-gray-100 transition-colors"
          >
            <span className="text-black font-medium">{result.collocation}</span>
            {result.frequency > 0 && (
              <span className="text-xs text-gray-500 block mt-1">
                Frequency: {result.frequency}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}