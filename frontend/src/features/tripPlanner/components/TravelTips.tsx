import React, { useState, useEffect } from 'react';
import styles from '../styles/TravelTips.module.css';

const travelTips = [
  "Did you know? The Great Wall of China is not visible from space with the naked eye.",
  "Travel tip: Roll your clothes instead of folding them to save space in your luggage.",
  "Fun fact: Japan has more than 50,000 people who are over 100 years old.",
  "Travel hack: Empty water bottles can be taken through airport security and filled up after.",
  "Did you know? The Eiffel Tower can be 15 cm taller during summer due to thermal expansion.",
  "Travel tip: Tuesday is often the cheapest day to fly.",
  "Fun fact: Singapore's Changi Airport has a butterfly garden with over 1,000 butterflies.",
  "Travel hack: Use a shower cap to cover your shoes in your suitcase to keep clothes clean.",
  "Did you know? The shortest commercial flight is between Westray and Papa Westray in Scotland's Orkney Islands, lasting just under 2 minutes.",
  "Travel tip: Take a photo of your parking spot at the airport to remember where you parked."
];

const TravelTips: React.FC = () => {
  const [currentTip, setCurrentTip] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % travelTips.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={styles.tipContainer}>
      <div className={styles.tipIcon}>💡</div>
      <p className={styles.tipText}>{travelTips[currentTip]}</p>
    </div>
  );
};

export default TravelTips;