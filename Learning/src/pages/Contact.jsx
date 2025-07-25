import React from "react";
import "../styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-info">
          <div className="info-box">
            <i className="icon fas fa-map-marker-alt"></i>
            <h3>OUR MAIN OFFICE</h3>
            <p>SaltLake, Kolkata-700021<br />West Bengal, India</p>
          </div>
          <div className="info-box">
            <i className="icon fas fa-phone"></i>
            <h3>PHONE NUMBER</h3>
            <p>+91 98833 83924<br />+91 70030 99216</p>
          </div>
          <div className="info-box">
            <i className="icon fas fa-fax"></i>
            <h3>FAX</h3>
            <p>1-234-567-8900</p>
          </div>
          <div className="info-box">
            <i className="icon fas fa-envelope"></i>
            <h3>EMAIL</h3>
            <p>hello@theme.com</p>
          </div>
        </div>

        <div className="contact-form">
          <h2>Contact Us</h2>
          <form>
            <input type="text" placeholder="Enter your Name" required />
            <input type="email" placeholder="Enter a valid email address" required />
            <textarea placeholder="Your Message" rows="5"></textarea>
            <button type="submit">SUBMIT</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
