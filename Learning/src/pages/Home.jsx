import React from "react";
import useScrollFadeIn from "../hooks/useScrollFadeIn";
import "../styles/Home.css";
import projectImage from "../assets/anime.jpg"; // sample image path

const Home = () => {
  const fadeInLeft = useScrollFadeIn("left", 1, 0);
  const fadeInRight = useScrollFadeIn("right", 1, 0.3);

  return (
    <div className="home-container">
      <div className="home-content" {...fadeInLeft}>
        <h1>EngiLearn AI: Empowering Engineering Minds</h1>
        <p>
          Discover a centralized platform that revolutionizes how engineering
          students learn and grow.
        </p>
        <div className="home-buttons">
          <button className="btn-primary">Get Started</button>
          <button className="btn-outline">Learn More</button>
        </div>
      </div>
      <div className="home-image" {...fadeInRight}>
        <img src={projectImage} alt="EngiLearn Project" />
      </div>
    </div>
  );
};

export default Home;
