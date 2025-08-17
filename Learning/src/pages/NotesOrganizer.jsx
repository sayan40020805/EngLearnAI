import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/NotesOrganizer.css';

const NotesOrganizer = () => {
  const { streamId, semester, subject } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notes');
  
  // Sample PDF files - these would be in your public/notes folder
  const notesData = [
    { id: 1, title: 'Chapter 1 - Introduction', file: 'notes1.pdf', size: '2.5 MB' },
    { id: 2, title: 'Chapter 2 - Core Concepts', file: 'notes2.pdf', size: '3.1 MB' },
    { id: 3, title: 'Chapter 3 - Advanced Topics', file: 'notes3.pdf', size: '2.8 MB' },
    { id: 4, title: 'Complete Notes', file: 'complete-notes.pdf', size: '8.5 MB' },
    { id: 5, title: 'Quick Revision Guide', file: 'revision-guide.pdf', size: '1.2 MB' }
  ];

  const organizerData = [
    { id: 1, title: 'Study Schedule Template', file: 'study-schedule.pdf', size: '0.5 MB' },
    { id: 2, title: 'Assignment Tracker', file: 'assignment-tracker.pdf', size: '0.3 MB' },
    { id: 3, title: 'Exam Preparation Checklist', file: 'exam-checklist.pdf', size: '0.4 MB' },
    { id: 4, title: 'Formula Sheet', file: 'formula-sheet.pdf', size: '0.2 MB' },
    { id: 5, title: 'Project Planner', file: 'project-planner.pdf', size: '0.6 MB' }
  ];

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

  const handleDownload = (fileName) => {
    // In a real app, these files would be in public/notes/[stream]/[semester]/[subject]/
    const filePath = `/notes/${streamId}/${semester}/${decodeURIComponent(subject)}/${fileName}`;
    window.open(filePath, '_blank');
  };

  return (
    <div className="notes-organizer-container">
      <div className="header-section">
        <h1>{decodeURIComponent(subject)}</h1>
        <div className="breadcrumb">
          <span>{getStreamName(streamId)}</span> {'>'} 
          <span>Semester {semester}</span> {'>'} 
          <span>{decodeURIComponent(subject)}</span>
        </div>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
        <button 
          className={`tab-button ${activeTab === 'organizer' ? 'active' : ''}`}
          onClick={() => setActiveTab('organizer')}
        >
          Organizer
        </button>
      </div>

      <div className="content-section">
        {activeTab === 'notes' ? (
          <div className="notes-section">
            <h2>Study Notes</h2>
            <div className="files-grid">
              {notesData.map((note) => (
                <div key={note.id} className="file-card">
                  <div className="file-icon">📄</div>
                  <h3>{note.title}</h3>
                  <p className="file-size">{note.size}</p>
                  <button 
                    className="download-btn"
                    onClick={() => handleDownload(note.file)}
                  >
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="organizer-section">
            <h2>Study Organizers</h2>
            <div className="files-grid">
              {organizerData.map((organizer) => (
                <div key={organizer.id} className="file-card">
                  <div className="file-icon">📋</div>
                  <h3>{organizer.title}</h3>
                  <p className="file-size">{organizer.size}</p>
                  <button 
                    className="download-btn"
                    onClick={() => handleDownload(organizer.file)}
                  >
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="navigation-buttons">
        <button className="back-button" onClick={() => navigate(`/subject-selection/${streamId}/${semester}`)}>
          Back to Subjects
        </button>
        <button className="home-button" onClick={() => navigate('/stream-selection')}>
          Back to Stream Selection
        </button>
      </div>
    </div>
  );
};

export default NotesOrganizer;
