// src/components/ReportCard.jsx

import React from "react";
import "../styles/ReportCard.css";

const ReportCard = ({ subject, grade, percentage, remarks }) => {
  return (
    <div className="report-card">
      <div className="report-header">
        <h3>{subject}</h3>
        <span className={`grade ${grade}`}>{grade}</span>
      </div>
      <div className="report-details">
        <p>
          <strong>Percentage:</strong> {percentage}%
        </p>
        <p>
          <strong>Remarks:</strong> {remarks}
        </p>
      </div>
    </div>
  );
};

export default ReportCard;
