// src/pages/Notes.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Notes.css"; // Optional styling

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get("/api/notes"); // Adjust endpoint if needed
        setNotes(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load notes.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) return <p>Loading notes...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="notes-container">
      <h2>Notes</h2>
      {notes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        <ul className="notes-list">
          {notes.map((note) => (
            <li key={note._id} className="note-item">
              <h3>{note.title}</h3>
              <p>{note.description}</p>
              <a
                href={note.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="download-btn"
              >
                Download PDF
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notes;
