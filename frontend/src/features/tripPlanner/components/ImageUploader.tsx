// src/features/tripPlanner/components/ImageUploader.tsx
import React from 'react';
import styles from '../styles/ImageUploader.module.css';

interface ImageUploaderProps {
  preview: string | null;
  loading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  hasFile: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  preview, 
  loading, 
  onFileChange, 
  onUpload, 
  hasFile 
}) => {
  return (
    <div className={styles.uploadSection}>
      <div 
        className={styles.dropzone}
        style={{
          border: preview ? '2px dashed #e2e8f0' : '2px dashed #ccc',
          backgroundColor: '#f8fafc',
        }}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        {!preview ? (
          <div className={styles.dropzoneContent}>
            <div className={styles.uploadIcon}>📷</div>
            <p>Click or drag an image here</p>
          </div>
        ) : (
          <div className={styles.imagePreviewContainer}>
            <img 
              src={preview || "/placeholder.svg"} 
              alt="Preview" 
              className={styles.imagePreview} 
            />
          </div>
        )}
        <input 
          id="file-input"
          type="file" 
          accept="image/*"
          onChange={onFileChange} 
          className={styles.fileInput} 
        />
      </div>
      
      <button 
        onClick={onUpload} 
        disabled={loading || !hasFile} 
        className={styles.button}
      >
        {loading ? "Processing..." : "Analyze Image"}
      </button>
    </div>
  );
};

export default ImageUploader;