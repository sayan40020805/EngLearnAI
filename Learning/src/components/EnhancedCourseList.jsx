import React, { useEffect, useState } from "react";
import API from "../utils/api";
import "../styles/CourseList.css";

const EnhancedCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const languages = ["all", "Java", "Python", "C", "C++", "JavaScript", "SQL"];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const url = selectedLanguage === "all"
          ? "/enhanced-courses"
          : `/enhanced-courses/language/${selectedLanguage}`;

        const res = await API.get(url);
        setCourses(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedLanguage]);

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="enhanced-course-list">
      <h2>Programming Courses with Free Certificates</h2>
      
      <div className="language-filter">
        <label>Select Language: </label>
        <select 
          value={selectedLanguage} 
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {languages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <div className="course-grid">
        {courses.length === 0 ? (
          <p>No courses available.</p>
        ) : (
          courses.map((course) => (
            <div key={course._id} className="course-card">
              <h3>{course.courseCode} - {course.courseName}</h3>
              <p className="course-description">{course.description}</p>
              
              <div className="course-details">
                <p><strong>Language:</strong> {course.language}</p>
                <p><strong>Level:</strong> {course.difficulty}</p>
                <p><strong>Credits:</strong> {course.credits}</p>
                <p><strong>Department:</strong> {course.department}</p>
                <p><strong>Semester:</strong> {course.semester}</p>
              </div>

              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="prerequisites">
                  <h4>Prerequisites:</h4>
                  <ul>
                    {course.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                </div>
              )}

              {course.linkedCertificateCourses && course.linkedCertificateCourses.length > 0 && (
                <div className="certificate-courses">
                  <h4>Free Certificate Courses:</h4>
                  <ul>
                    {course.linkedCertificateCourses.map((cert) => (
                      <li key={cert._id}>
                        <a 
                          href={cert.courseUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="certificate-link"
                        >
                          {cert.title} ({cert.platform})
                        </a>
                        <span className="duration"> - {cert.duration}</span>
                        <a 
                          href={cert.certificateUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="certificate-badge"
                        >
                          Get Certificate
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="course-actions">
                <button 
                  className="view-details-btn"
                  onClick={() => window.open(`/course/${course._id}`, '_blank')}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EnhancedCourseList;
