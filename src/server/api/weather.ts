import { OpenMeteoDailyResponse, WeatherDay } from '@/types/weather';

/**
 * Fetches weather forecast data from Open-Meteo API
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param startDate - Trip start date
 * @param endDate - Trip end date
 * @returns Promise<WeatherDay[]> - Array of weather data for each day
 */
export async function fetchWeatherForecast(
  latitude: number,
  longitude: number,
  startDate: Date,
  endDate: Date
): Promise<WeatherDay[]> {
  try {
    // Format dates as YYYY-MM-DD for API
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', latitude.toString());
    url.searchParams.set('longitude', longitude.toString());
    url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min');
    url.searchParams.set('start_date', startDateStr);
    url.searchParams.set('end_date', endDateStr);
    url.searchParams.set('timezone', 'auto');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(
        `Weather API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data: OpenMeteoDailyResponse = await response.json();

    const weatherDays: WeatherDay[] = data.daily.time.map((day, index) => ({
      day,
      maxTemp: data.daily.temperature_2m_max[index],
      lowTemp: data.daily.temperature_2m_min[index],
    }));

    return weatherDays;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw new Error('Failed to fetch weather forecast');
  }
}
