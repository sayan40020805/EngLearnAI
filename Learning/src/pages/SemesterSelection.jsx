import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/SemesterSelection.css';

const SemesterSelection = () => {
  const { streamId } = useParams();
  const navigate = useNavigate();
  
  const semesters = Array.from({ length: 8 }, (_, i) => i + 1);

  const handleSemesterSelect = (semester) => {
    navigate(`/subject-selection/${streamId}/${semester}`);
  };

  const getStreamName = (streamId) => {
    const streams = {
      cse: 'Computer Science Engineering',
      ece: 'Electronics & Communication Engineering',
      ee: 'Electrical Engineering',
      ce: 'Civil Engineering',
      aiml: 'Artificial Intelligence & Machine Learning',
      ds: 'Data Science'
    };
    return streams[streamId] || 'Unknown Stream';
  };

  return (
    <div className="semester-selection-container">
      <h1>Select Semester</h1>
      <p className="stream-info">Stream: {getStreamName(streamId)}</p>
      
      <div className="semesters-grid">
        {semesters.map((sem) => (
          <div 
            key={sem} 
            className="semester-card"
            onClick={() => handleSemesterSelect(sem)}
          >
            <h3>Semester {sem}</h3>
            <p>Click to view subjects</p>
          </div>
        ))}
      </div>
      
      <button className="back-button" onClick={() => navigate('/stream-selection')}>
        Back to Stream Selection
      </button>
    </div>
  );
};

export default SemesterSelection;
