import React, { useState } from 'react';
import axios from 'axios';

function Home() {
  const [file, setFile] = useState(null);
  const [uploadData, setUploadData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUploadData(null);
    setWeatherData(null);
    
    // Create preview
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please choose an image.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:5000/api/upload", formData);
      setUploadData(res.data);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (location) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://127.0.0.1:5000/api/weather?location=${location}`);
      setWeatherData(res.data);
    } catch (error) {
      console.error("Weather error:", error);
      alert("Failed to fetch weather.");
    } finally {
      setLoading(false);
    }
  };

  // Weather icon helper
  const getWeatherEmoji = (weather) => {
    const w = weather.toLowerCase();
    if (w.includes('rain')) return '🌧️';
    if (w.includes('cloud')) return '☁️';
    if (w.includes('sun') || w.includes('clear')) return '☀️';
    if (w.includes('snow')) return '❄️';
    return '🌤️';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>✈️ Trip Planner</h2>
          <p style={styles.subtitle}>Upload a photo to discover travel destinations and weather forecasts</p>
        </div>
        
        <div style={styles.content}>
          {/* Upload Section */}
          <div style={styles.uploadSection}>
            <div 
              style={{
                ...styles.dropzone,
                backgroundImage: preview ? `url(${preview})` : 'none',
                backgroundSize: preview ? 'cover' : 'auto',
                backgroundPosition: 'center',
                border: preview ? 'none' : '2px dashed #ccc',
              }}
              onClick={() => document.getElementById('file-input').click()}
            >
              {!preview && (
                <div style={styles.dropzoneContent}>
                  <div style={styles.uploadIcon}>📷</div>
                  <p>Click or drag an image here</p>
                </div>
              )}
              <input 
                id="file-input"
                type="file" 
                onChange={handleFileChange} 
                style={styles.fileInput} 
              />
            </div>
            
            <button 
              onClick={handleUpload} 
              disabled={loading || !file} 
              style={{
                ...styles.button,
                opacity: loading || !file ? 0.7 : 1,
                cursor: loading || !file ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? "Processing..." : "Analyze Image"}
            </button>
          </div>

          {/* Results Section */}
          {uploadData && (
            <div style={styles.resultsContainer}>
              <div style={styles.resultsSection}>
                <div style={styles.sceneInfo}>
                  <h3 style={styles.sectionTitle}>Scene Analysis</h3>
                  <div style={styles.sceneType}>
                    <span>{uploadData.scene_type}</span>
                  </div>
                </div>

                <div style={styles.locationsSection}>
                  <h3 style={styles.sectionTitle}>Suggested Locations</h3>
                  <div style={styles.locationsList}>
                    {uploadData.suggested_locations.map((place, idx) => (
                      <button 
                        key={idx}
                        onClick={() => fetchWeather(place.city)}
                        style={styles.locationButton}
                        disabled={loading}
                      >
                        <span style={styles.locationName}>📍 {place.name}</span>
                        <span style={styles.locationDetails}>{place.city}, {place.country}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weather Section */}
              {weatherData && (
                <div style={styles.weatherSection}>
                  <h3 style={styles.sectionTitle}>Weather Forecast</h3>
                  <div style={styles.weatherList}>
                    {weatherData.map((day, idx) => (
                      <div key={idx} style={styles.weatherCard}>
                        <div style={styles.weatherHeader}>
                          <span style={styles.weatherDate}>{day.date}</span>
                          <span style={styles.weatherTemp}>{day.temperature}°C</span>
                        </div>
                        <div style={styles.weatherDetails}>
                          <div style={styles.weatherCondition}>
                            <span style={styles.weatherIcon}>{getWeatherEmoji(day.weather)}</span>
                            <span>{day.weather}</span>
                          </div>
                          <div style={styles.weatherStats}>
                            <span>💨 {day.wind_speed} m/s</span>
                            <span>💧 {day.humidity}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    padding: '2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
  },
  header: {
    padding: '1.5rem 2rem',
    background: 'linear-gradient(to right, #3b82f6, #2563eb)',
    color: 'white',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    fontSize: '1rem',
    fontWeight: '400',
    margin: 0,
    opacity: 0.9,
  },
  content: {
    padding: '2rem',
  },
  uploadSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  dropzone: {
    width: '100%',
    height: '250px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#f8fafc',
  },
  dropzoneContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#64748b',
  },
  uploadIcon: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  fileInput: {
    display: 'none',
  },
  button: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  resultsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    margin: '0 0 1rem 0',
    color: '#1e293b',
  },
  sceneInfo: {
    marginBottom: '1rem',
  },
  sceneType: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '20px',
    fontWeight: '500',
  },
  locationsSection: {
    marginBottom: '1rem',
  },
  locationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  locationButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '1rem',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  locationName: {
    fontWeight: '600',
    fontSize: '1rem',
    color: '#1e293b',
  },
  locationDetails: {
    fontSize: '0.875rem',
    color: '#64748b',
    marginTop: '0.25rem',
  },
  weatherSection: {
    marginTop: '1rem',
  },
  weatherList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  weatherCard: {
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  weatherHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  weatherDate: {
    fontWeight: '600',
    color: '#1e293b',
  },
  weatherTemp: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1e40af',
  },
  weatherDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  weatherCondition: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  weatherIcon: {
    fontSize: '1.25rem',
  },
  weatherStats: {
    display: 'flex',
    gap: '1rem',
    color: '#64748b',
    fontSize: '0.875rem',
    marginTop: '0.5rem',
  },
};

export default Home;