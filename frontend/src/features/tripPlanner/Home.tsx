import React, { useState } from 'react';
import { uploadImage, fetchWeather } from './services/tripPlannerService';
import { UploadResponse, WeatherDay } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import SceneAnalysis from './components/SceneAnalysis';
import LocationList from './components/LocationList';
import WeatherForecast from './components/WeatherForecast';
import styles from './styles/Home.module.css';
import { SceneAnalysisSkeleton, LocationsSkeleton } from './components/LoadingSkeletons';
import ProcessingIndicator from './components/ProcessingIndicator';

const Home: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadData, setUploadData] = useState<UploadResponse | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherDay[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  
  // New state variables for handling long processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

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
    
    // Create a new AbortController for this request
    const controller = new AbortController();
    setAbortController(controller);
    
    setLoading(true);
    setIsProcessing(true);
    
    try {
      const res = await uploadImage(file, controller.signal);
      setUploadData(res);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        alert("Upload failed.");
        console.error(err);
      }
    } finally {
      setLoading(false);
      setIsProcessing(false);
      setAbortController(null);
    }
  };

  const handleFetchWeather = async (city: string) => {
    // Create a new AbortController for this request
    const controller = new AbortController();
    setAbortController(controller);
    
    setLoading(true);
    setActiveLocation(city);
    
    try {
      const res = await fetchWeather(city, controller.signal);
      setWeatherData(res);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        alert("Weather fetch failed.");
        console.error(err);
      }
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
      setLoading(false);
      setIsProcessing(false);
      setAbortController(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Header />
        
        <div className={styles.content}>
          <ImageUploader 
            preview={preview}
            loading={loading && !isProcessing}
            onFileChange={handleFileChange}
            onUpload={handleUpload}
            hasFile={!!file}
          />

          {/* Processing Indicator for long-running operations */}
          <ProcessingIndicator 
            isProcessing={isProcessing} 
            onCancel={handleCancel} 
          />

          {/* Show skeletons while loading after upload but not during initial processing */}
          {loading && !isProcessing && !uploadData && (
            <>
              <div className={styles.skeletonContainer}>
                <SceneAnalysisSkeleton />
                <LocationsSkeleton />
              </div>
            </>
          )}

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
                  sceneType={uploadData.scene_type}
                />
              </div>

              {/* Show weather skeleton while loading weather data */}
              {loading && !weatherData && activeLocation && (
                <div className={styles.weatherSkeletonContainer}>
                  <div className={styles.weatherSkeleton}>
                    <div className={styles.weatherSkeletonHeader}></div>
                    <div className={styles.weatherSkeletonItems}>
                      {[1, 2, 3].map(i => (
                        <div key={i} className={styles.weatherSkeletonItem}>
                          <div className={styles.weatherSkeletonDate}></div>
                          <div className={styles.weatherSkeletonDetails}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

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