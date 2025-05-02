export interface Location {
  name: string;
  city: string;
  country: string;
  popularity_rank: number;
  reason: string;
  relevance_score: number;
}

export interface UploadResponse {
  file_url: string;
  filename: string;
  message: string;
  scene_type: string;
  suggested_locations: Location[];
}

export interface WeatherDay {
  date: string;
  weather: string;
  temperature: number;
  wind_speed: number;
  humidity: number;
}