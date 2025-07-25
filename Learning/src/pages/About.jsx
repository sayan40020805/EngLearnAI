import React from "react";
import "../styles/About.css";

const About = () => {
  return (
    <div className="about-container">
      <h1>About EngiLearn AI</h1>
      <p>
        EngiLearn AI is a platform built to revolutionize how engineering
        students learn, practice, and excel. From curated semester notes to
        progress tracking and exam readiness, we aim to centralize your academic
        journey in one place.
      </p>
      <h2>Why EngiLearn AI?</h2>
      <ul>
        <li>📚 Streamlined semester notes and resources</li>
        <li>📈 Real-time progress tracking</li>
        <li>🧠 AI-powered learning and assistance</li>
        <li>📝 Easy access to department-specific courses and exams</li>
        <li>💡 Empowering minds to think, innovate, and build</li>
      </ul>
    </div>
  );
};

export default About;
