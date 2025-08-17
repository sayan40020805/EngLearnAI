import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/SubjectSelection.css';

// Sample subjects for each stream and semester
const subjectsData = {
  cse: {
    1: ['Programming in C', 'Engineering Mathematics-I', 'Physics', 'Basic Electrical Engineering', 'Communication Skills'],
    2: ['Data Structures', 'Engineering Mathematics-II', 'Digital Electronics', 'Computer Organization', 'Environmental Science'],
    3: ['Object Oriented Programming', 'Discrete Mathematics', 'Computer Networks', 'Database Management Systems', 'Software Engineering'],
    4: ['Operating Systems', 'Design and Analysis of Algorithms', 'Microprocessors', 'Theory of Computation', 'Web Technologies'],
    5: ['Artificial Intelligence', 'Machine Learning', 'Cloud Computing', 'Cyber Security', 'Mobile Computing'],
    6: ['Big Data Analytics', 'Internet of Things', 'Blockchain Technology', 'Natural Language Processing', 'Computer Vision'],
    7: ['Deep Learning', 'Distributed Systems', 'Quantum Computing', 'Edge Computing', 'Software Testing'],
    8: ['Advanced AI', 'Robotics', 'Augmented Reality', 'Digital Image Processing', 'Project Management']
  },
  ece: {
    1: ['Electronic Devices', 'Engineering Mathematics-I', 'Physics', 'Basic Electrical Engineering', 'Communication Skills'],
    2: ['Digital Electronics', 'Engineering Mathematics-II', 'Circuit Theory', 'Analog Electronics', 'Environmental Science'],
    3: ['Signals and Systems', 'Electromagnetic Theory', 'Microprocessors', 'Control Systems', 'Digital Signal Processing'],
    4: ['Analog Communication', 'VLSI Design', 'Embedded Systems', 'Antenna Theory', 'Microwave Engineering'],
    5: ['Digital Communication', 'Wireless Communication', 'Optical Communication', 'Satellite Communication', 'RF Circuit Design'],
    6: ['Advanced DSP', 'Communication Networks', 'IoT Systems', '5G Technology', 'Radar Systems'],
    7: ['Advanced VLSI', 'System on Chip', 'Photonics', 'Nanoelectronics', 'Advanced Communication Systems'],
    8: ['Research Methodology', 'Project Work', 'Seminar', 'Industrial Training', 'Dissertation']
  },
  ee: {
    1: ['Basic Electrical Engineering', 'Engineering Mathematics-I', 'Physics', 'Chemistry', 'Communication Skills'],
    2: ['Circuit Theory', 'Engineering Mathematics-II', 'Electrical Machines', 'Power Systems', 'Environmental Science'],
    3: ['Power Electronics', 'Control Systems', 'Electrical Measurements', 'Digital Electronics', 'Microprocessors'],
    4: ['Power System Analysis', 'Electrical Machine Design', 'High Voltage Engineering', 'Renewable Energy', 'Smart Grid'],
    5: ['Power System Protection', 'HVDC Transmission', 'Electrical Drives', 'Energy Management', 'Industrial Automation'],
    6: ['Advanced Power Electronics', 'Electric Vehicles', 'Power Quality', 'Distributed Generation', 'Microgrid Systems'],
    7: ['Power System Dynamics', 'Flexible AC Transmission', 'Energy Storage', 'Smart Grid Technologies', 'Research Methods'],
    8: ['Project Work', 'Seminar', 'Industrial Training', 'Dissertation', 'Advanced Topics']
  },
  ce: {
    1: ['Engineering Mechanics', 'Engineering Mathematics-I', 'Physics', 'Chemistry', 'Communication Skills'],
    2: ['Strength of Materials', 'Engineering Mathematics-II', 'Surveying', 'Fluid Mechanics', 'Environmental Science'],
    3: ['Structural Analysis', 'Concrete Technology', 'Geotechnical Engineering', 'Water Resources', 'Transportation Engineering'],
    4: ['Design of Steel Structures', 'Environmental Engineering', 'Foundation Engineering', 'Construction Management', 'Highway Engineering'],
    5: ['Advanced Structural Analysis', 'Prestressed Concrete', 'Irrigation Engineering', 'Bridge Engineering', 'Earthquake Engineering'],
    6: ['Construction Technology', 'Project Management', 'Urban Planning', 'GIS and Remote Sensing', 'Sustainable Construction'],
    7: ['Advanced Foundation Engineering', 'Structural Dynamics', 'Coastal Engineering', 'Environmental Impact Assessment', 'Research Methods'],
    8: ['Project Work', 'Seminar', 'Industrial Training', 'Dissertation', 'Advanced Topics']
  },
  aiml: {
    1: ['Programming Fundamentals', 'Engineering Mathematics-I', 'Physics', 'Basic Electrical Engineering', 'Communication Skills'],
    2: ['Data Structures', 'Engineering Mathematics-II', 'Digital Logic Design', 'Computer Organization', 'Environmental Science'],
    3: ['Python Programming', 'Discrete Mathematics', 'Statistics for AI', 'Machine Learning Fundamentals', 'Database Systems'],
    4: ['Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Reinforcement Learning', 'AI Ethics'],
    5: ['Advanced ML', 'Big Data Analytics', 'Robotics', 'Speech Recognition', 'AI Applications'],
    6: ['Advanced NLP', 'Advanced Computer Vision', 'Edge AI', 'Explainable AI', 'AI Security'],
    7: ['Research Methods', 'Advanced Topics in AI/ML', 'Quantum Computing', 'Neuromorphic Computing', 'AI for Healthcare'],
    8: ['Project Work', 'Seminar', 'Industrial Training', 'Dissertation', 'Advanced Research']
  },
  ds: {
    1: ['Programming Fundamentals', 'Engineering Mathematics-I', 'Statistics-I', 'Basic Electrical Engineering', 'Communication Skills'],
    2: ['Data Structures', 'Engineering Mathematics-II', 'Statistics-II', 'Database Systems', 'Environmental Science'],
    3: ['Python for Data Science', 'Machine Learning', 'Data Visualization', 'Big Data Technologies', 'Statistical Methods'],
    4: ['Deep Learning', 'Natural Language Processing', 'Time Series Analysis', 'Cloud Computing', 'Data Engineering'],
    5: ['Advanced ML', 'Big Data Analytics', 'Data Mining', 'Business Intelligence', 'Data Governance'],
    6: ['Advanced Statistics', 'Deep Learning Applications', 'Data Ethics', 'Data Security', 'Real-time Analytics'],
    7: ['Research Methods', 'Advanced Data Science', 'AI for Data Science', 'Data Science Applications', 'Industry Projects'],
    8: ['Project Work', 'Seminar', 'Industrial Training', 'Dissertation', 'Advanced Research']
  }
};

const SubjectSelection = () => {
  const { streamId, semester } = useParams();
  const navigate = useNavigate();
  
  const subjects = subjectsData[streamId]?.[parseInt(semester)] || [];
  
  const handleSubjectSelect = (subject) => {
    navigate(`/notes-organizer/${streamId}/${semester}/${encodeURIComponent(subject)}`);
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
    <div className="subject-selection-container">
      <h1>Select Subject</h1>
      <div className="selection-info">
        <p><strong>Stream:</strong> {getStreamName(streamId)}</p>
        <p><strong>Semester:</strong> {semester}</p>
      </div>
      
      <div className="subjects-grid">
        {subjects.map((subject, index) => (
          <div 
            key={index} 
            className="subject-card"
            onClick={() => handleSubjectSelect(subject)}
          >
            <h3>{subject}</h3>
            <p>Click to view notes & organizer</p>
          </div>
        ))}
      </div>
      
      <div className="navigation-buttons">
        <button className="back-button" onClick={() => navigate(`/semester-selection/${streamId}`)}>
          Back to Semester Selection
        </button>
        <button className="home-button" onClick={() => navigate('/stream-selection')}>
          Back to Stream Selection
        </button>
      </div>
    </div>
  );
};

export default SubjectSelection;
