import { supabase } from "@/app/lib/supabaseClient";
import ProgressList from "./ProgressList"

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

  return <ProgressList progress={progress || []} />;
}
