import { GeocodingResponse } from '@/types/geocoding';

/**
 * Fetches location data from Open-Meteo Geocoding API
 * @param query - Location name or postal code to search for
 * @returns Promise<GeocodingResponse> - Geocoding API response
 */
export async function searchLocation(
  query: string
): Promise<GeocodingResponse> {
  try {
    if (!query || query.length < 2) {
      return { results: [] };
    }

    const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
    url.searchParams.set('name', query);
    url.searchParams.set('count', '1');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(
        `Geocoding API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data: GeocodingResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching geocoding data:', error);
    throw new Error('Failed to fetch location data');
  }
}

