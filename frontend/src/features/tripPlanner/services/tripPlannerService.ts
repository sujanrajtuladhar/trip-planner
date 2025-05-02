import axios, { AxiosRequestConfig } from 'axios';
import { UploadResponse, WeatherDay } from '../types';

const API = import.meta.env.VITE_API_BASE_URL; // Will use your .env file

export const uploadImage = async (file: File, signal?: AbortSignal): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Configure axios to work with AbortSignal
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  };
  
  // Add cancellation support if signal is provided
  if (signal) {
    const source = axios.CancelToken.source();
    
    // Listen for abort signal and cancel the axios request when triggered
    signal.addEventListener('abort', () => {
      source.cancel('Request was cancelled');
    });
    
    config.cancelToken = source.token;
  }
  
  try {
    const response = await axios.post(`${API}/upload`, formData, config);
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      // Create an error that matches the AbortError from fetch API
      const abortError = new Error('Request aborted');
      abortError.name = 'AbortError';
      throw abortError;
    }
    throw error;
  }
};

export const fetchWeather = async (location: string, signal?: AbortSignal): Promise<WeatherDay[]> => {
  // Configure axios to work with AbortSignal
  const config: AxiosRequestConfig = {};
  
  // Add cancellation support if signal is provided
  if (signal) {
    const source = axios.CancelToken.source();
    
    // Listen for abort signal and cancel the axios request when triggered
    signal.addEventListener('abort', () => {
      source.cancel('Request was cancelled');
    });
    
    config.cancelToken = source.token;
  }
  
  try {
    const response = await axios.get(`${API}/weather?location=${encodeURIComponent(location)}`, config);
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      // Create an error that matches the AbortError from fetch API
      const abortError = new Error('Request aborted');
      abortError.name = 'AbortError';
      throw abortError;
    }
    throw error;
  }
};