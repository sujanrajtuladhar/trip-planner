// src/features/tripPlanner/components/WeatherForecast.tsx
import React from 'react';
import { WeatherDay } from '../types';
import styles from '../styles/WeatherForecast.module.css';

interface WeatherForecastProps {
  weatherData: WeatherDay[];
  location: string | null;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ weatherData, location }) => {
  const getWeatherEmoji = (weather: string): string => {
    const w = weather.toLowerCase();
    if (w.includes('rain')) return '🌧️';
    if (w.includes('cloud')) return '☁️';
    if (w.includes('sun') || w.includes('clear')) return '☀️';
    if (w.includes('snow')) return '❄️';
    return '🌤️';
  };

  return (
    <div className={styles.weatherSection}>
      <h3 className={styles.sectionTitle}>
        Weather Forecast
        {location && <span className={styles.weatherLocation}> for {location}</span>}
      </h3>
      <div className={styles.weatherList}>
        {weatherData.map((day, idx) => (
          <div key={idx} className={styles.weatherCard}>
            <div className={styles.weatherHeader}>
              <span className={styles.weatherDate}>{day.date}</span>
              <span className={styles.weatherTemp}>{day.temperature}°C</span>
            </div>
            <div className={styles.weatherDetails}>
              <div className={styles.weatherCondition}>
                <span className={styles.weatherIcon}>{getWeatherEmoji(day.weather)}</span>
                <span>{day.weather}</span>
              </div>
              <div className={styles.weatherStats}>
                <span>💨 {day.wind_speed} m/s</span>
                <span>💧 {day.humidity}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;