import React, { useEffect, useState } from "react";
import API from "../utils/api";
import "../styles/AllCourseList.css";

const AllCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "all",
    "java",
    "c",
    "python",
    "html",
    "css",
    "javascript",
    "react",
    "nextjs",
    "ece",
    "ee",
    "mechanical",
    "civil"
  ];

  const categoryDisplayNames = {
    all: "All Courses",
    java: "Java Programming",
    c: "C Programming",
    python: "Python Programming",
    html: "HTML",
    css: "CSS",
    javascript: "JavaScript",
    react: "React JS",
    nextjs: "Next JS",
    ece: "Electronics & Communication Engineering",
    ee: "Electrical Engineering",
    mechanical: "Mechanical Engineering",
    civil: "Civil Engineering"
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let url = "/api/enhanced-courses";

        if (selectedCategory !== "all") {
          url = `/api/enhanced-courses/language/${selectedCategory}`;
        }

        const res = await API.get(url);
        setCourses(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedCategory]);

  const filteredCourses = courses.filter(course => 
    course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="all-course-list">
      <h2>{categoryDisplayNames[selectedCategory]}</h2>
      
      <div className="course-controls">
        <div className="category-selector">
          <label htmlFor="category">Select Category: </label>
          <select 
            id="category"
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {categoryDisplayNames[category]}
              </option>
            ))}
          </select>
        </div>
        
        <div className="search-box">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <p>No courses available for {categoryDisplayNames[selectedCategory]}.</p>
      ) : (
        <div className="course-grid">
          {filteredCourses.map((course) => (
            <div key={course._id} className="course-card">
              <h3>{course.courseName}</h3>
              <p className="instructor-name">
                <strong>Instructor:</strong> {course.instructor}
              </p>
              <p className="course-category">
                <strong>Category:</strong> {course.language || course.category || "General"}
              </p>
              
              {course.description && (
                <p className="course-description">{course.description}</p>
              )}
              
              {course.linkedCertificateCourses && course.linkedCertificateCourses.length > 0 && (
                <div className="platform-links">
                  <h4>Education Platforms:</h4>
                  <ul>
                    {course.linkedCertificateCourses.map((cert) => (
                      <li key={cert._id}>
                        <a 
                          href={cert.courseUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="platform-link"
                        >
                          {cert.platform}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCourseList;
