import React, { useState } from 'react';
import { Location } from '../types';
import styles from '../styles/LocationList.module.css';

interface LocationListProps {
  locations: Location[];
  onSelectLocation: (city: string) => void;
  activeLocation: string | null;
  loading: boolean;
  sceneType: string;
}

const LocationList: React.FC<LocationListProps> = ({ 
  locations, 
  onSelectLocation, 
  activeLocation, 
  loading,
  sceneType
}) => {
  const [displayCount, setDisplayCount] = useState(3);
  
  const showMoreLocations = () => {
    setDisplayCount(prev => Math.min(prev + 3, locations.length));
  };
  
  // Sort locations by relevance score (highest first)
  const sortedLocations = [...locations].sort((a, b) => b.relevance_score - a.relevance_score);
  const displayedLocations = sortedLocations.slice(0, displayCount);
  const hasMoreLocations = displayCount < locations.length;

  const formattedSceneType = sceneType.replace(/['"]/g, '').toLowerCase();

  return (
    <div className={styles.locationsSection}>
      <h3 className={styles.sectionTitle}>
        Top Destinations for {formattedSceneType}
      </h3>
      <p className={styles.rankingExplanation}>
        Destinations are ranked based on relevance to your image and global popularity.
      </p>
      
      <div className={styles.locationsList}>
        {displayedLocations.map((place, idx) => (
          <button 
            key={idx}
            onClick={() => onSelectLocation(place.city)}
            className={`${styles.locationButton} ${activeLocation === place.city ? styles.active : ''}`}
            disabled={loading}
          >
            <div className={styles.locationHeader}>
              <span className={styles.locationName}>📍 {place.name}</span>
              <div className={styles.rankingBadges}>
                <span className={styles.relevanceBadge} title="Relevance to your image">
                  {Math.round(place.relevance_score * 100)}% Match
                </span>
                <span className={styles.popularityBadge} title="Global popularity ranking">
                  #{place.popularity_rank} Popular
                </span>
              </div>
            </div>
            <span className={styles.locationDetails}>{place.city}, {place.country}</span>
            <span className={styles.locationReason}>{place.reason}</span>
          </button>
        ))}
      </div>
      
      {hasMoreLocations && (
        <button 
          onClick={showMoreLocations} 
          className={styles.showMoreButton}
          disabled={loading}
        >
          <span className={styles.showMoreIcon}>✨</span>
          Show me more {formattedSceneType} destinations
        </button>
      )}
    </div>
  );
};

export default LocationList;