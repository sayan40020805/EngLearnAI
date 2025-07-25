// src/pages/Exam.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Exam.css"; // Optional styling file

const Exam = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get("/api/exams"); // Update endpoint if needed
        setExams(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch exams.");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) return <p>Loading exams...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="exam-container">
      <h2>Upcoming Exams</h2>
      {exams.length === 0 ? (
        <p>No exams found.</p>
      ) : (
        <ul className="exam-list">
          {exams.map((exam) => (
            <li key={exam._id} className="exam-item">
              <h3>{exam.courseName}</h3>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(exam.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {exam.time}
              </p>
              <p>
                <strong>Semester:</strong> {exam.semester}
              </p>
              <p>
                <strong>Department:</strong> {exam.department}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Exam;
