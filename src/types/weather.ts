export interface WeatherDay {
  day: string; // Format: YYYY-MM-DD
  maxTemp: number;
  lowTemp: number;
}

export interface OpenMeteoDailyResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
  daily_units: {
    temperature_2m_max: string;
    temperature_2m_min: string;
  };
}

