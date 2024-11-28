"use client";

import Link from "next/link";

interface ProgressListProps {
  progress: {
    collocation: string;
    relation: string;
    examples: string[];
  }[];
}

export default function ProgressList({ progress }: ProgressListProps) {

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Progress</h1>
      {progress.length === 0 ? (
        <p className="text-center">No collocations added yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {progress.map((item, index) => (
            <Link
                key = {index}
                href={{
                    pathname: `/detail/${item.collocation}`, // URL
                    query: {collocation: item.collocation, relation: item.relation, example: JSON.stringify(item.examples)} // 検索クエリ
                }}
                className="cursor-pointer border border-gray-300 p-4 rounded-md shadow-md bg-white hover:bg-gray-100 transition"
            >
                <span className="text-black font-medium">{item.collocation}</span>
                {item.relation && (
                    <span className="text-sm text-gray-700 block mt-1">
                    Relation: {item.relation}
                    </span>
                )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
