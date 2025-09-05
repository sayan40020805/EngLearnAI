import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StreamSelection.css';

const streams = [
  { id: 'cse', name: 'Computer Science Engineering', short: 'CSE' },
  { id: 'ece', name: 'Electronics & Communication Engineering', short: 'ECE' },
  { id: 'ee', name: 'Electrical Engineering', short: 'EE' },
  { id: 'ce', name: 'Civil Engineering', short: 'CE' },
  { id: 'aiml', name: 'Artificial Intelligence & Machine Learning', short: 'AIML' },
  { id: 'ds', name: 'Data Science', short: 'Data Science' }
];

const StreamSelection = () => {
  const navigate = useNavigate();

  const handleStreamSelect = (streamId) => {
    navigate(`/semester-selection/${streamId}`);
  };

  return (
    <div className="stream-selection-container">
      <h1>Select Your Stream</h1>
      <div className="streams-grid">
        {streams.map((stream) => (
          <div 
            key={stream.id} 
            className="stream-card"
            onClick={() => handleStreamSelect(stream.id)}
          >
            <h3>{stream.short}</h3>
            <p>{stream.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreamSelection;
