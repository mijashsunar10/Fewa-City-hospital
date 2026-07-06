import React from 'react';
import './Skeleton.css';

// Base pulsing block
export const Skeleton = ({ height, width, borderRadius, style }) => {
  return (
    <div 
      className="skeleton-shimmer-container" 
      style={{ 
        height: height || '20px', 
        width: width || '100%', 
        borderRadius: borderRadius || '4px',
        ...style 
      }} 
    />
  );
};

// Doctor Card Skeleton Grid
export const DoctorSkeleton = ({ count = 6 }) => {
  return (
    <div className="doctor-skeleton-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div className="doctor-skeleton-card" key={idx}>
          <div className="doctor-skeleton-image-wrapper">
            <Skeleton height="100%" borderRadius="0px" />
          </div>
          <div className="doctor-skeleton-info">
            <div className="doctor-skeleton-line">
              <Skeleton height="24px" width="70%" />
            </div>
            <div className="doctor-skeleton-line">
              <Skeleton height="16px" width="50%" />
            </div>
            <div className="doctor-skeleton-line" style={{ marginTop: '20px' }}>
              <Skeleton height="40px" borderRadius="8px" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Service Card Skeleton Grid
export const ServiceSkeleton = ({ count = 6 }) => {
  return (
    <div className="service-skeleton-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div className="service-skeleton-card" key={idx}>
          <div className="service-skeleton-accent"></div>
          <div className="service-skeleton-image">
            <Skeleton height="100%" borderRadius="0px" />
          </div>
          <div className="service-skeleton-content">
            <div style={{ marginBottom: '12px' }}>
              <Skeleton height="24px" width="80%" />
            </div>
            <div style={{ marginBottom: '8px' }}>
              <Skeleton height="14px" width="100%" />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Skeleton height="14px" width="90%" />
            </div>
            <div>
              <Skeleton height="42px" borderRadius="8px" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Department Tab List Skeleton
export const DepartmentSkeleton = ({ count = 5 }) => {
  return (
    <div className="department-skeleton-tabs">
      {Array.from({ length: count }).map((_, idx) => (
        <Skeleton 
          className="department-skeleton-tab-item" 
          height="60px" 
          borderRadius="8px" 
          key={idx} 
        />
      ))}
    </div>
  );
};
