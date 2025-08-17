import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Exam.css';

const Exam = () => {
  const navigate = useNavigate();

  const handleStartExam = () => {
    navigate('/exam');
  };

  return (
    <div className="exam-container">
      <h2>Available Exams</h2>
      <div className="exam-intro">
        <p>Ready to test your knowledge? Our AI-powered exam system generates custom exams based on your selected subjects and difficulty level.</p>
        
        <div className="exam-features">
          <h3>Features:</h3>
          <ul>
            <li>Custom subject selection</li>
            <li>Adjustable difficulty levels (Easy, Medium, Hard)</li>
            <li>Flexible question count (5-20 questions)</li>
            <li>Instant scoring and detailed explanations</li>
            <li>Progress tracking</li>
          </ul>
        </div>

        <button onClick={handleStartExam} className="btn-primary">
          Start Custom Exam
        </button>
      </div>
    </div>
  );
};

export default Exam;
