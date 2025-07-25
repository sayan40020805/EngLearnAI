import React from "react";
import useAuth from "../hooks/useAuth";
import "../styles/Dashboard.css"; // Optional: For styling

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard">
      <h1>Welcome to the Dashboard</h1>

      {user ? (
        <div className="user-info">
          <p>
            <strong>Name:</strong> {user.name || "No Name"}
          </p>
          <p>
            <strong>Email:</strong> {user.email || "No Email"}
          </p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}

      {/* Add more dashboard content below */}
      <div className="dashboard-content">
        <h2>Your Dashboard Features</h2>
        <ul>
          <li>Feature 1</li>
          <li>Feature 2</li>
          <li>Feature 3</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
