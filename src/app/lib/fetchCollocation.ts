import { APIResponse } from "@/app/lib/types";

export async function fetchCollocations(word: string): Promise<APIResponse> {
  try {
    const response = await fetch(`/api/collocation?word=${encodeURIComponent(word)}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch collocations. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return { collocations: [], error: "Failed to fetch collocations. Please try again." };
  }
}
