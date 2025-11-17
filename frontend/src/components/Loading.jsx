import React from 'react';
import './Loading.scss';

const Loading = ({ fullScreen = false }) => {
  return (
    <div className={`loading-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="brand-text">Bastard</div>
      </div>
    </div>
  );
};

export default Loading;