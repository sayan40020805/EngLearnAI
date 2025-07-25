// src/components/ProgressBar.jsx

import React from "react";
import "../styles/ProgressBar.css";

const ProgressBar = ({ label, progress }) => {
  return (
    <div className="progress-container">
      <div className="progress-label">
        {label} <span>{progress}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
