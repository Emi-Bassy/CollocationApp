import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { CollocationResult } from "@/app/lib/types";
import { relationMap } from "@/app/lib/types";

interface DetailViewProps {
  result: CollocationResult;
  onClose: () => void;
}

export function DetailView({ result, onClose }: DetailViewProps) {
    const relationInfo = relationMap[result.relation];

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
                <p className="text-sm">例: {relationInfo.example}</p>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Example Sentences</h3>
            <ul className="list-disc pl-5 space-y-2">
              {result.examples.map((example, index) => (
                <li
                  key={index}
                  dangerouslySetInnerHTML={{ __html: example }}
                  className="text-gray-800"
                />
              ))}
            </ul>
          </div>
        </div>
      );
    }