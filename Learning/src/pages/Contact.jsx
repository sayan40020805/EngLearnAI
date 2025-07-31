import React from 'react';
import "../styles/Contact.css"
import { FaMapMarkerAlt, FaPhoneAlt, FaFax, FaEnvelope } from 'react-icons/fa';

function Contact() {
  return (
    <div className="contact-container">
      {/* Left Side - Info Cards */}
      <div className="contact-info">
        <div className="info-card">
          <FaMapMarkerAlt style={{ fontSize: "60px", color: "#00a8b5", marginBottom: "10px" }} />
          <h3>OUR MAIN OFFICE</h3>
          <p>SoHo 94 Broadway St<br />New York, NY 1001</p>
        </div>
        <div className="info-card">
          <FaPhoneAlt style={{ fontSize: "60px", color: "#00a8b5", marginBottom: "10px" }} />
          <h3>PHONE NUMBER</h3>
          <p>234-9876-5400<br />888-0123-4567 (Toll Free)</p>
        </div>
        <div className="info-card">
          <FaFax style={{ fontSize: "60px", color: "#00a8b5", marginBottom: "10px" }} />
          <h3>FAX</h3>
          <p>1-234-567-8900</p>
        </div>
        <div className="info-card">
          <FaEnvelope style={{ fontSize: "60px", color: "#00a8b5", marginBottom: "10px" }} />
          <h3>EMAIL</h3>
          <p><a href="mailto:hello@theme.com">hello@theme.com</a></p>
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
