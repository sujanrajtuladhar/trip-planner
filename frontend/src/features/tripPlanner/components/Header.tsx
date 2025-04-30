import React from 'react';
import styles from '../styles/Header.module.css';

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>✈️ Trip Planner</h2>
      <p className={styles.subtitle}>Upload a photo to discover travel destinations and weather forecasts</p>
    </div>
  );
};

export default Header;