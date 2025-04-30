import axios from 'axios';
import { UploadResponse, WeatherDay } from '../types';

const API = import.meta.env.VITE_API_BASE_URL; // Will use your .env file

export const uploadImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API}/upload`, formData);
  return response.data;
};

export const fetchWeather = async (location: string): Promise<WeatherDay[]> => {
  const response = await axios.get(`${API}/weather?location=${location}`);
  return response.data;
};
