import React from 'react';
import "../styles/Contact.css"
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

function Contact() {
  return (
    <div className="contact-container">
      {/* Left Side - Info Cards */}
      <div className="contact-info">
        <div className="info-card">
          <FaMapMarkerAlt style={{ fontSize: "60px", color: "#00a8b5", marginBottom: "10px" }} />
          <h3>OUR LOCATION</h3>
          <p>Bally, West Bengal</p>
        </div>
        <div className="info-card">
          <FaPhoneAlt style={{ fontSize: "60px", color: "#00a8b5", marginBottom: "10px" }} />
          <h3>PHONE NUMBER</h3>
          <p>+91 7003099216</p>
        </div>
        <div className="info-card">
          <FaEnvelope style={{ fontSize: "60px", color: "#00a8b5", marginBottom: "10px" }} />
          <h3>EMAIL</h3>
          <p><a href="mailto:ssayanmjhi204@gmail.com">ssayanmjhi204@gmail.com</a></p>
        </div>
      </div>

      {/* Right Side - Contact Form */}
      <div className="contact-form">
        <h2>Contact Us</h2>
        <form>
          <input type="text" placeholder="Enter your Name" required />
          <input type="email" placeholder="Enter a valid email address" required />
          <textarea placeholder="Your Message" rows="5" required></textarea>
          <button type="submit">SUBMIT</button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
