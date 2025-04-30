// src/features/tripPlanner/Home.tsx
import React, { useState } from 'react';
import { uploadImage, fetchWeather } from './services/tripPlannerService';
import { UploadResponse, WeatherDay } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import SceneAnalysis from './components/SceneAnalysis';
import LocationList from './components/LocationList';
import WeatherForecast from './components/WeatherForecast';
import styles from './styles/Home.module.css';

const Home: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadData, setUploadData] = useState<UploadResponse | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherDay[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setUploadData(null);
    setWeatherData(null);
    setActiveLocation(null);

    if (selected) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");
    setLoading(true);
    try {
      const res = await uploadImage(file);
      setUploadData(res);
    } catch (err) {
      alert("Upload failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchWeather = async (city: string) => {
    setLoading(true);
    setActiveLocation(city);
    try {
      const res = await fetchWeather(city);
      setWeatherData(res);
    } catch (err) {
      alert("Weather fetch failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Header />
        
        <div className={styles.content}>
          <ImageUploader 
            preview={preview}
            loading={loading}
            onFileChange={handleFileChange}
            onUpload={handleUpload}
            hasFile={!!file}
          />

          {uploadData && (
            <div className={styles.resultsContainer}>
              <div className={styles.resultsSection}>
                <SceneAnalysis 
                  imageUrl={uploadData.file_url} 
                  sceneType={uploadData.scene_type} 
                />

                <LocationList 
                  locations={uploadData.suggested_locations}
                  onSelectLocation={handleFetchWeather}
                  activeLocation={activeLocation}
                  loading={loading}
                />
              </div>

              {weatherData && (
                <WeatherForecast 
                  weatherData={weatherData}
                  location={activeLocation}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;