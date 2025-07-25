import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import "../styles/Sidebar.css";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <nav className={`navbar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          ☰
        </button>
        <div className="navbar-brand">EngiLearn AI</div>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>×</button>
        <ul>
          <li><Link to="/notes">Notes & Organizer</Link></li>
          <li><Link to="/youtube">YouTube Section</Link></li>
          <li><Link to="/courses">Free Courses</Link></li>
        </ul>
      </div>

      {/* Backdrop */}
      {sidebarOpen && <div className="backdrop active" onClick={toggleSidebar}></div>}
    </>
  );
}
