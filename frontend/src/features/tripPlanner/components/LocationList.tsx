import React from 'react';
import { Location } from '../types';
import styles from '../styles/LocationList.module.css';

interface LocationListProps {
  locations: Location[];
  onSelectLocation: (city: string) => void;
  activeLocation: string | null;
  loading: boolean;
}

const LocationList: React.FC<LocationListProps> = ({ 
  locations, 
  onSelectLocation, 
  activeLocation, 
  loading 
}) => {
  return (
    <div className={styles.locationsSection}>
      <h3 className={styles.sectionTitle}>Suggested Locations</h3>
      <div className={styles.locationsList}>
        {locations.map((place, idx) => (
          <button 
            key={idx}
            onClick={() => onSelectLocation(place.city)}
            className={`${styles.locationButton} ${activeLocation === place.city ? styles.active : ''}`}
            disabled={loading}
          >
            <span className={styles.locationName}>📍 {place.name}</span>
            <span className={styles.locationDetails}>{place.city}, {place.country}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocationList;