import { APIResponse } from '../../lib/types';

const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || 'fd22b77fdfmsha3a7f731bbaaf84p122f13jsnff0be6253f1c';
const API_HOST = process.env.NEXT_PUBLIC_RAPIDAPI_HOST || 'linguatools-english-collocations.p.rapidapi.com';

export async function fetchCollocations(word: string): Promise<APIResponse> {
  try {
    const response = await fetch(
      `https://linguatools-english-collocations.p.rapidapi.com/bolls/v2?lang=en&query=${word}&max_results=25`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST,
        },
      }
    );

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return { collocations: data };
  } catch (error) {
    console.error('API Error:', error);
    return { 
      collocations: [],
      error: 'Failed to fetch collocations. Please try again.' 
    };
  }
}