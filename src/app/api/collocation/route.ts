import { NextResponse } from "next/server";

const API_KEY = process.env.LINGUATOOLS_COLLOCATIONAPI_KEY;
const API_HOST = process.env.LINGUATOOLS_COLLOCATIONAPI_HOST;

if (!API_KEY || !API_HOST) {
  throw new Error("API Key and Host must be defined in environment variables.");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get("word");

  if (!word) {
    return NextResponse.json(
      { collocations: [], error: "Word parameter is required." },
      { status: 400 }
    );
  }

  try {
    const headers = new Headers({
      "x-rapidapi-key": API_KEY as string,
      "x-rapidapi-host": API_HOST as string,
    });

    const response = await fetch(
      `https://linguatools-english-collocations.p.rapidapi.com/bolls/v2?lang=en&query=${word}&max_results=25`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ collocations: data });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { collocations: [], error: "Failed to fetch collocations. Please try again." },
      { status: 500 }
    );
  }
}
