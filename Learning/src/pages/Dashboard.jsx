import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Dashboard - User object:", user);
    if (user) {
      // Use user data from AuthContext directly
      setUserData({
        name: user.name || user.user?.name || '',
        email: user.email || user.user?.email || '',
        college: user.college || user.user?.college || '',
        bio: user.bio || user.user?.bio || '',
        marks: user.marks || user.user?.marks || [],
        profilePicture: user.profilePicture || user.user?.profilePicture || ''
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  // Removed fetchUserData function as we're using AuthContext data directly

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Welcome to Your Dashboard</h1>

      {userData ? (
        <div className="dashboard-container">
          {/* User Profile Section */}
          <div className="user-profile-section">
            <h2>User Profile</h2>
            <div className="user-info-card">
              <div className="user-avatar">
                {userData.profilePicture ? (
                  <img src={userData.profilePicture} alt={userData.name} />
                ) : (
                  <div className="avatar-placeholder">{userData.name?.charAt(0).toUpperCase()}</div>
                )}
              </div>
              <div className="user-details">
                <p><strong>Name:</strong> {userData.name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>College:</strong> {userData.college}</p>
                <p><strong>Bio:</strong> {userData.bio || "No bio added yet"}</p>
              </div>
            </div>
          </div>

          {/* Exam History Section */}
          <div className="exam-history-section">
            <h2>Exam History</h2>
            {userData.marks && userData.marks.length > 0 ? (
              <div className="exam-cards">
                {userData.marks.map((exam, index) => (
                  <div key={index} className="exam-card">
                    <h3>{exam.examName}</h3>
                    <div className="exam-details">
                      <p><strong>Marks:</strong> {exam.marks}/{exam.totalMarks}</p>
                      <p><strong>Percentage:</strong> {exam.percentage}%</p>
                      <p><strong>Date:</strong> {new Date(exam.date).toLocaleDateString()}</p>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${exam.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-exams">
                <p>No exam history found. Take your first exam to see results here!</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="not-logged-in">
          <p>You are not logged in. Please login to view your dashboard.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
