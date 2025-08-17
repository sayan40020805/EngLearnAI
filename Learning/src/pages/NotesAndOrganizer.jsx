import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotesOrganizer.css';

export default function NotesAndOrganizer() {
  return (
    <div className="notes-organizer-container">
      <h1>Notes & Organizer</h1>
      <p>Select your engineering stream to access notes and study materials:</p>
      
      <div className="organizer-options">
        <div className="option-card">
          <h3>Stream Selection</h3>
          <p>Choose your engineering stream to get started with notes and study materials</p>
          <Link to="/stream-selection" className="organizer-btn">
            Select Your Stream
          </Link>
        </div>
      </div>
    </div>
  );
}
