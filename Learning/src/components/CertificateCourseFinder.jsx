import React, { useEffect, useState } from "react";
import API from "../utils/api";
import "../styles/CourseList.css";

const CertificateCourseFinder = () => {
  const [certificateCourses, setCertificateCourses] = useState([]);
  const [filters, setFilters] = useState({
    language: "all",
    platform: "all",
    level: "all"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const languages = ["all", "Java", "Python", "C", "C++", "JavaScript", "HTML/CSS", "SQL"];
  const platforms = ["all", "Udemy", "Unacademy", "DataFlair", "Coursera", "edX", "YouTube", "FreeCodeCamp"];
  const levels = ["all", "Beginner", "Intermediate", "Advanced"];

  useEffect(() => {
    const fetchCertificateCourses = async () => {
      try {
        const params = { isFree: true };

        if (filters.language !== "all") params.language = filters.language;
        if (filters.platform !== "all") params.platform = filters.platform;
        if (filters.level !== "all") params.level = filters.level;

        const res = await API.get("/certificate-courses", { params });
        setCertificateCourses(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load certificate courses.");
        setLoading(false);
      }
    };

    fetchCertificateCourses();
  }, [filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  if (loading) return <p>Loading certificate courses...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="certificate-course-finder">
      <h2>Free Certificate Courses</h2>
      
      <div className="filter-section">
        <div className="filter-group">
          <label>Language:</label>
          <select 
            value={filters.language} 
            onChange={(e) => handleFilterChange('language', e.target.value)}
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Platform:</label>
          <select 
            value={filters.platform} 
            onChange={(e) => handleFilterChange('platform', e.target.value)}
          >
            {platforms.map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Level:</label>
          <select 
            value={filters.level} 
            onChange={(e) => handleFilterChange('level', e.target.value)}
          >
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="certificate-grid">
        {certificateCourses.length === 0 ? (
          <p>No certificate courses available.</p>
        ) : (
          certificateCourses.map((course) => (
            <div key={course._id} className="certificate-card">
              <h3>{course.title}</h3>
              <p className="platform-badge">{course.platform}</p>
              
              <div className="course-info">
                <p><strong>Language:</strong> {course.language}</p>
                <p><strong>Level:</strong> {course.level}</p>
                <p><strong>Duration:</strong> {course.duration}</p>
                <p><strong>Description:</strong> {course.description}</p>
              </div>

              <div className="course-tags">
                {course.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>

              <div className="course-actions">
                <a 
                  href={course.courseUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="course-link-btn"
                >
                  Start Course
                </a>
                <a 
                  href={course.certificateUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="certificate-link-btn"
                >
                  Get Certificate
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CertificateCourseFinder;
