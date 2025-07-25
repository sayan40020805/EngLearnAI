import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/SemesterNotes.css";

const SemesterNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/notes"); // Adjust the API path as needed
        setNotes(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching notes:", err); // Log actual error to console
        setError("Failed to load notes.");
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="notes-container">
      <h2>Semester Notes</h2>
      {loading ? (
        <p>Loading notes...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : notes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        <div className="notes-list">
          {notes.map((note) => (
            <div className="note-card" key={note._id}>
              <h3>{note.subject}</h3>
              <p>Semester: {note.semester}</p>
              <a
                href={note.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <button>Download</button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SemesterNotes;
