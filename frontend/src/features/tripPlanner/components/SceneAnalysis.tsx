import React from 'react';
import styles from '../styles/SceneAnalysis.module.css';

interface SceneAnalysisProps {
  imageUrl: string;
  sceneType: string;
}

const SceneAnalysis: React.FC<SceneAnalysisProps> = ({ imageUrl, sceneType }) => {
  // Remove quotes from scene type if present
  const formattedSceneType = sceneType.replace(/['"]/g, '');
  
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
          <span>{formattedSceneType}</span>
        </div>
        <p className={styles.sceneExplanation}>
          Based on your image, we've identified this as a {formattedSceneType.toLowerCase()}. 
          We've curated destinations that feature similar sacred architecture, cultural significance, 
          and spiritual importance from around the world.
        </p>
      </div>
    </>
  );
};

export default SceneAnalysis;