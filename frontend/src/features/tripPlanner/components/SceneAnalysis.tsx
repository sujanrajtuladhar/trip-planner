import React from 'react';
import styles from '../styles/SceneAnalysis.module.css';

interface SceneAnalysisProps {
  imageUrl: string;
  sceneType: string;
}

const SceneAnalysis: React.FC<SceneAnalysisProps> = ({ imageUrl, sceneType }) => {
  return (
    <>
      <div className={styles.uploadedImageContainer}>
        <img 
          src={imageUrl || "/placeholder.svg"} 
          alt="Uploaded scene" 
          className={styles.uploadedImage} 
        />
      </div>
      
      <div className={styles.sceneInfo}>
        <h3 className={styles.sectionTitle}>Scene Analysis</h3>
        <div className={styles.sceneType}>
          <span>{sceneType}</span>
        </div>
      </div>
    </>
  );
};

export default SceneAnalysis;