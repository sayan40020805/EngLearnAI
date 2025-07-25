// src/pages/CourseList.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/CourseList.css"; // Optional: your own CSS file

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("/api/courses"); // Adjust endpoint if needed
        setCourses(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="course-list">
      <h2>Available Courses</h2>
      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course._id}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>
                <strong>Department:</strong> {course.department}
              </p>
              <p>
                <strong>Semester:</strong> {course.semester}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseList;
