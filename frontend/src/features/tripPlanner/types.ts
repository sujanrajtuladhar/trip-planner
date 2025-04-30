export interface Location {
  name: string;
  city: string;
  country: string;
}

export interface UploadResponse {
  file_url: string;
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