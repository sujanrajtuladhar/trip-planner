import React, { useState, useEffect } from 'react';
import styles from '../styles/ProcessingIndicator.module.css';
import TravelTips from './TravelTips';

interface ProcessingIndicatorProps {
  isProcessing: boolean;
  onCancel: () => void;
}

const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({ isProcessing, onCancel }) => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Analyzing your image...');
  
  useEffect(() => {
    if (!isProcessing) {
      setProgress(0);
      return;
    }
    
    // Simulate progress for visual feedback
    const timer = setInterval(() => {
      setProgress(prev => {
        // Slow down progress as it gets higher to avoid reaching 100% too quickly
        const increment = Math.max(1, 10 - Math.floor(prev / 10));
        const newProgress = Math.min(95, prev + increment); // Never reach 100% automatically
        
        // Update status message based on progress
        if (newProgress > 80) {
          setStatusMessage('Almost there! Finding the best destinations...');
        } else if (newProgress > 60) {
          setStatusMessage('Matching with similar destinations worldwide...');
        } else if (newProgress > 30) {
          setStatusMessage('Identifying architectural features...');
        }
        
        return newProgress;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isProcessing]);
  
  if (!isProcessing) return null;
  
  return (
    <div className={styles.processingContainer}>
      <div className={styles.processingContent}>
        <div className={styles.iconContainer}>
          <div className={styles.pulsingDot}></div>
          <div className={styles.pulsingRing}></div>
        </div>
        <h3 className={styles.processingTitle}>Processing Your Image</h3>
        <p className={styles.processingMessage}>{statusMessage}</p>
        <div className={styles.progressBarContainer}>
          <div 
            className={styles.progressBar} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className={styles.estimateMessage}>
          This may take up to 60 seconds due to advanced AI processing
        </p>
        
        <TravelTips />
        
        <button 
          className={styles.cancelButton}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ProcessingIndicator;