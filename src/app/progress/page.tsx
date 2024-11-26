import { supabase } from "@/app/lib/supabaseClient";

export const metadata = {
  title: "Progress",
};

export default async function ProgressPage() {
  const { data: progress, error } = await supabase.from("progress").select("*");

  if (error) {
    console.error("Error fetching progress:", error.message);
    return (
      <div>
        <h1 className="text-3xl font-bold text-center mb-8">Progress</h1>
        <p className="text-red-600 text-center">Failed to load progress data.</p>
      </div>
    );
  }

  return (
    <div>
      <main className="p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Progress</h1>
        {progress && progress.length === 0 ? (
          <p className="text-center">No collocations added yet.</p>
        ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {progress.map((item, index) => (
              <div
                key={index}
                className="border border-gray-300 p-4 rounded-md shadow-md bg-white"
              >
                <span className="text-black font-medium">{item.collocation}</span>
                {item.relation && (
                  <span className="text-sm text-gray-700 block mt-1">
                    Relation: {item.relation}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
