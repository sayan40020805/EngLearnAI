// src/components/ProgressBar.jsx
import React, { useState } from "react";
import "../styles/ProgressBar.css";

const ProgressBar = ({ label, totalModules }) => {
  const [completedModules, setCompletedModules] = useState(0);
  const [progress, setProgress] = useState(0);
  const [examScore, setExamScore] = useState("");
  const [needsRetake, setNeedsRetake] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const incrementModules = () => {
    if (completedModules < totalModules) {
      setCompletedModules((prev) => prev + 1);
    }
  };

  const decrementModules = () => {
    if (completedModules > 0) {
      setCompletedModules((prev) => prev - 1);
    }
  };

  const calculateProgress = () => {
    const newProgress = (completedModules / totalModules) * 100;
    setProgress(newProgress);
    setIsSubmitted(true);
  };

  const resetProgress = () => {
    setCompletedModules(0);
    setProgress(0);
    setExamScore("");
    setNeedsRetake(false);
    setIsSubmitted(false);
  };

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h3>{label}</h3>
        <div className="module-status">
          Completed: {completedModules} / {totalModules}
        </div>
      </div>

      <div className="progress-display">
        <div className="progress-label">
          Progress: <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="module-controls">
        <button
          className="module-btn decrement"
          onClick={decrementModules}
          disabled={completedModules <= 0}
        >
          -
        </button>
        <div className="module-count">{completedModules}</div>
        <button
          className="module-btn increment"
          onClick={incrementModules}
          disabled={completedModules >= totalModules}
        >
          +
        </button>
      </div>

      <div className="exam-section">
        <div className="exam-score">
          <label>Exam Score (%):</label>
          <input
            type="number"
            value={examScore}
            onChange={(e) => setExamScore(e.target.value)}
            min="0"
            max="100"
            disabled={isSubmitted}
          />
        </div>
        <div className="retake-check">
          <label>
            <input
              type="checkbox"
              checked={needsRetake}
              onChange={(e) => setNeedsRetake(e.target.checked)}
              disabled={isSubmitted}
            />
            Needs retake
          </label>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="submit-btn"
          onClick={calculateProgress}
          disabled={isSubmitted}
        >
          Calculate Progress
        </button>
        <button className="reset-btn" onClick={resetProgress}>
          Reset
        </button>
      </div>

      {isSubmitted && (
        <div className="results">
          <p>Your completion progress: {progress.toFixed(1)}%</p>
          {examScore && <p>Exam score: {examScore}%</p>}
          {needsRetake && (
            <p className="retake-warning">You need to retake the exam</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
