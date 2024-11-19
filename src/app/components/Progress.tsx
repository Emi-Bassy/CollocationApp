import { CollocationResult } from '@/app/lib/types';

interface ProgressProps {
  progress: CollocationResult[];
}

export default function Progress({ progress }: ProgressProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">Progress</h1>
      <ul className="list-disc pl-5 space-y-2 text-black">
        {progress.length === 0 ? (
          <p>No collocations added yet.</p>
        ) : (
          progress.map((item, index) => (
            <li key={index} className="text-lg">
              <span className="font-semibold">{item.collocation}</span> -{' '}
              {item.relation}
              <ul>
                {item.examples.map((example, i) => (
                  <li key={i} className="ml-4 text-sm text-gray-700">
                    {example}
                  </li>
                ))}
              </ul>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
