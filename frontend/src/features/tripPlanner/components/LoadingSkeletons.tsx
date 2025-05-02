import React from 'react';
import styles from '../styles/LoadingSkeletons.module.css';

export const SceneAnalysisSkeleton: React.FC = () => (
  <div className={styles.skeleton}>
    <div className={styles.imageSkeletonContainer}>
      <div className={styles.imageSkeleton}></div>
    </div>
    <div className={styles.titleSkeleton}></div>
    <div className={styles.typeSkeleton}></div>
    <div className={styles.descriptionSkeleton}>
      <div></div>
      <div></div>
      <div style={{ width: '70%' }}></div>
    </div>
  </div>
);

export const LocationsSkeleton: React.FC = () => (
  <div className={styles.skeleton}>
    <div className={styles.titleSkeleton}></div>
    <div className={styles.subtitleSkeleton}></div>
    {[1, 2, 3].map((i) => (
      <div key={i} className={styles.locationSkeleton}>
        <div className={styles.locationHeaderSkeleton}>
          <div className={styles.locationNameSkeleton}></div>
          <div className={styles.badgesSkeleton}>
            <div></div>
            <div></div>
          </div>
        </div>
        <div className={styles.locationDetailsSkeleton}></div>
        <div className={styles.locationReasonSkeleton}>
          <div></div>
          <div></div>
        </div>
      </div>
    ))}
  </div>
);