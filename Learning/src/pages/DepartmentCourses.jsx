import React, { useEffect, useState } from "react";
import API from "../utils/api";
import useAuth from "../hooks/useAuth";
import "../styles/DepartmentCourses.css"; // Optional CSS

const DepartmentCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!user || !user.department) {
          setError("Department not found for the user.");
          setLoading(false);
          return;
        }

        const response = await API.get(
          `/courses/department/${user.department}`
        );
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching courses:", err.message);
        setError("Failed to fetch department courses.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="department-courses">
      <h2>Courses for Department: {user?.department}</h2>
      {courses.length === 0 ? (
        <p>No courses found for this department.</p>
      ) : (
        <ul className="course-list">
          {courses.map((course) => (
            <li key={course._id} className="course-item">
              <h3>
                {course.courseCode} - {course.courseName}
              </h3>
              <p>
                <strong>Instructor:</strong> {course.instructor || "N/A"}
              </p>
              <p>
                <strong>Credits:</strong> {course.credits || "N/A"}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {course.description || "No description"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DepartmentCourses;
