import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../styles/Navbar.css";
import "../styles/Sidebar.css";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
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
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          ×
        </button>
        <ul>
          <li>
            <Link to="/notes">Notes & Organizer</Link>
          </li>
          <li>
            <Link to="/youtube">YouTube Section</Link>
          </li>
          <li>
            <Link to="/courses">Free Courses</Link>
          </li>
          <li>
            <Link to="/exam">Exam</Link>
          </li>
          <li>
            <Link to="/progressbar">Progress Bar</Link>
          </li>
          {user && (
            <li>
              <Link to="/dashboard">User Dashboard</Link>
            </li>
          )}
        </ul>
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div className="backdrop active" onClick={toggleSidebar}></div>
      )}
    </>
  );
}
