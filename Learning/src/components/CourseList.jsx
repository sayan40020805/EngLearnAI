// src/components/CourseList.jsx

import React, { useEffect, useState } from "react";
import API from "../utils/api";
import "../styles/CourseList.css"; // Optional: your own CSS file

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("/courses");
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
      <h2>Free Courses</h2>
      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course._id} className="course-item">
              <h3>{course.courseCode} - {course.courseName}</h3>
              <p>{course.description}</p>
              <p>
                <strong>Department:</strong> {course.department}
              </p>
              <p>
                <strong>Semester:</strong> {course.semester}
              </p>
              <p>
                <strong>Credits:</strong> {course.credits}
              </p>
              <p>
                <strong>Instructor:</strong> {course.instructor}
              </p>
              <p>
                <strong>Language:</strong> {course.language}
              </p>
              <p>
                <strong>Difficulty:</strong> {course.difficulty}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseList;
