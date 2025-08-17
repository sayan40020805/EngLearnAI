import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const { user, login } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    college: "",
    bio: "",
    profilePicture: "",
  });
  const [marksData, setMarksData] = useState({
    examName: "",
    marks: "",
    totalMarks: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("UserProfile - User object:", user);
    if (user) {
      setProfileData({
        name: user.name || user.user?.name || "",
        college: user.college || user.user?.college || "",
        bio: user.bio || user.user?.bio || "",
        profilePicture: user.profilePicture || user.user?.profilePicture || "",
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      login({ ...user, ...response.data });
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMarks = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await axios.post(
        "http://localhost:5000/api/auth/marks",
        marksData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      login({ ...user, ...response.data });
      setMarksData({ examName: "", marks: "", totalMarks: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add marks");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMarks = async (markId) => {
    setLoading(true);
    setError("");

    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await axios.delete(
        `http://localhost:5000/api/auth/marks/${markId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      login({ ...user, ...response.data });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete marks");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please login to view your profile</div>;
  }

  return (
    <div className="user-profile-container">
      <h1>User Profile</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="profile-section">
        <h2>Basic Information</h2>
        {isEditing ? (
          <form onSubmit={handleProfileUpdate} className="profile-form">
            <input
              type="text"
              placeholder="Name"
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="College"
              value={profileData.college}
              onChange={(e) =>
                setProfileData({ ...profileData, college: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Bio"
              value={profileData.bio}
              onChange={(e) =>
                setProfileData({ ...profileData, bio: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Profile Picture URL"
              value={profileData.profilePicture}
              onChange={(e) =>
                setProfileData({ ...profileData, profilePicture: e.target.value })
              }
            />
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Save Changes"}
            </button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </form>
        ) : (
          <div className="profile-display">
            <div className="profile-picture">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" />
              ) : (
                <div className="default-avatar">{user.name?.charAt(0)}</div>
              )}
            </div>
            <h3>{user.name}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>College:</strong> {user.college}</p>
            <p><strong>Bio:</strong> {user.bio || "No bio added"}</p>
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          </div>
        )}
      </div>

      <div className="marks-section">
        <h2>Exam Results</h2>
        
        <form onSubmit={handleAddMarks} className="marks-form">
          <input
            type="text"
            placeholder="Exam Name"
            value={marksData.examName}
            onChange={(e) =>
              setMarksData({ ...marksData, examName: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Marks Obtained"
            value={marksData.marks}
            onChange={(e) =>
              setMarksData({ ...marksData, marks: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Total Marks"
            value={marksData.totalMarks}
            onChange={(e) =>
              setMarksData({ ...marksData, totalMarks: e.target.value })
            }
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Marks"}
          </button>
        </form>

        <div className="marks-list">
          {user.marks && user.marks.length > 0 ? (
            user.marks.map((mark) => (
              <div key={mark._id} className="mark-item">
                <h4>{mark.examName}</h4>
                <p>
                  Marks: {mark.marks}/{mark.totalMarks}
                </p>
                <p>Percentage: {mark.percentage}%</p>
                <p>Date: {new Date(mark.date).toLocaleDateString()}</p>
                <button
                  onClick={() => handleDeleteMarks(mark._id)}
                  disabled={loading}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No exam results added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
