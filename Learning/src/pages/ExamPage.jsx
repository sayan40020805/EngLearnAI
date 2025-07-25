import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "../styles/ExamPage.css";

const ExamPage = () => {
  const { user } = useContext(AuthContext);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/exams", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setExams(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching exams:", err.message);
        setError("Failed to load exams.");
        setLoading(false);
      }
    };

    if (user) {
      fetchExams();
    } else {
      setLoading(false);
      setError("Unauthorized. Please login first.");
    }
  }, [user]);

  if (loading) return <div className="exam-loading">Loading exams...</div>;
  if (error) return <div className="exam-error">{error}</div>;

  return (
    <div className="exam-page">
      <h2>Available Exams</h2>
      {exams.length === 0 ? (
        <p>No exams available at the moment.</p>
      ) : (
        <ul className="exam-list">
          {exams.map((exam) => (
            <li key={exam._id} className="exam-card">
              <h3>{exam.title}</h3>
              <p>
                <strong>Course:</strong> {exam.course}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(exam.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Duration:</strong> {exam.duration} minutes
              </p>
              <button className="start-exam-btn">Start Exam</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExamPage;
