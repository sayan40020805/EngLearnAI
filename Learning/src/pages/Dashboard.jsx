import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import API from "../utils/api";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserExamResults = async () => {
    try {
      const userId = user._id || user.user?._id || user.id;
      if (!userId) {
        setLoading(false);
        return;
      }

      const fetchEnhancedHistory = async (userId) => {
        try {
          const response = await API.get(`/api/enhanced-exams/user/${userId}/history`);
          if (response.status === 200 && response.data.success && response.data.submissions) {
            return response.data.submissions.map(sub => ({ ...sub, type: 'enhanced' }));
          }
          console.warn(`Enhanced exam history fetch failed: Status ${response.status} - ${response.statusText}`);
        } catch (error) {
          console.warn("Enhanced exam history fetch failed:", error);
        }
        return [];
      };

      const fetchLocalExamResults = async (userId) => {
        try {
          // Use local server for exam results
          const response = await fetch(`http://localhost:5000/api/dashboard?userId=${userId}`);
          if (response.ok) {
            const data = await response.json();
            return data.results.map(result => ({
              examName: result.examName || 'Enhanced Exam',
              marks: result.score,
              totalMarks: result.totalQuestions,
              percentage: result.percentage,
              date: result.timestamp,
              type: 'enhanced',
              subject: result.subject || 'General'
            }));
          }
          console.warn(`Local exam results fetch failed: Status ${response.status}`);
        } catch (error) {
          console.warn("Local exam results fetch failed:", error);
        }
        return [];
      };

      const fetchTraditionalHistory = async (userId) => {
        try {
          const response = await API.get(`/api/exams/user/${userId}/history`);
          if (response.status === 200 && response.data.success && response.data.submissions) {
            return response.data.submissions.map(sub => ({ ...sub, type: 'traditional' }));
          }
          console.warn(`Traditional exam history fetch failed: Status ${response.status} - ${response.statusText}`);
        } catch (error) {
          console.warn("Traditional exam history fetch failed:", error);
        }
        return [];
      };

      const fetchTopicQuizHistory = async (userId) => {
        try {
          const response = await API.get(`/api/topic-quiz/user/${userId}/history`);
          if (response.status === 200 && response.data.success && response.data.results) {
            return response.data.results.map(result => ({
              examName: `${result.topic} Quiz (${result.difficulty})`,
              marks: result.correctAnswers,
              totalMarks: result.totalQuestions,
              percentage: result.percentage,
              date: result.date || new Date(),
              type: 'topic-quiz',
              subject: result.topic
            }));
          }
          console.warn(`Topic quiz history fetch failed: Status ${response.status} - ${response.statusText}`);
        } catch (error) {
          console.warn("Topic quiz history fetch failed:", error);
        }
        return [];
      };

      const [enhancedResults, traditionalResults, topicQuizResults, localResults] = await Promise.all([
        fetchEnhancedHistory(userId),
        fetchTraditionalHistory(userId),
        fetchTopicQuizHistory(userId),
        fetchLocalExamResults(userId)
      ]);

      const allExams = [
        ...enhancedResults.map(sub => ({
          examName: sub.examName || 'Enhanced Exam',
          marks: sub.score || 0,
          totalMarks: sub.totalQuestions || 100,
          percentage: Math.round(sub.percentage || 0),
          date: sub.date || new Date(),
          type: 'enhanced',
          subject: sub.subject || 'General'
        })),
        ...traditionalResults.map(sub => ({
          examName: sub.examName || 'Traditional Exam',
          marks: sub.marks || 0,
          totalMarks: sub.totalMarks || 100,
          percentage: Math.round(((sub.marks || 0) / (sub.totalMarks || 100)) * 100),
          date: sub.date || new Date(),
          type: 'traditional',
          subject: sub.subject || 'General'
        })),
        ...topicQuizResults.map(sub => ({
          examName: sub.examName || 'Topic Quiz',
          marks: sub.marks || 0,
          totalMarks: sub.totalMarks || 100,
          percentage: Math.round(((sub.marks || 0) / (sub.totalMarks || 100)) * 100),
          date: sub.date || new Date(),
          type: 'topic-quiz',
          subject: sub.subject || 'General'
        })),
        ...localResults,
      ];

      // Also include any marks from user profile
      const profileMarks = user.marks || user.user?.marks || [];
      profileMarks.forEach(mark => {
        if (!allExams.some(exam => exam.examName === mark.examName)) {
          allExams.push({
            ...mark,
            type: 'profile',
            percentage: Math.round((mark.marks / mark.totalMarks) * 100)
          });
        }
      });

      // Sort by date (newest first)
      allExams.sort((a, b) => new Date(b.date) - new Date(a.date));

      setUserData({
        name: user.name || user.user?.name || '',
        email: user.email || user.user?.email || '',
        college: user.college || user.user?.college || '',
        bio: user.bio || user.user?.bio || '',
        marks: allExams,
        profilePicture: user.profilePicture || user.user?.profilePicture || ''
      });
    } catch (error) {
      console.error("Error fetching exam results:", error);
      // Fallback to user profile data
      setUserData({
        name: user.name || user.user?.name || '',
        email: user.email || user.user?.email || '',
        college: user.college || user.user?.college || '',
        bio: user.bio || user.user?.bio || '',
        marks: user.marks || user.user?.marks || [],
        profilePicture: user.profilePicture || user.user?.profilePicture || ''
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Dashboard - User object:", user);
    if (user) {
      // Fetch both traditional and enhanced exam results
      fetchUserExamResults();
    } else {
      setLoading(false);
    }

    // Listen for exam submission events
    const handleExamSubmitted = () => {
      console.log('Exam submitted, refreshing dashboard...');
      fetchUserExamResults();
    };

    window.addEventListener('examSubmitted', handleExamSubmitted);

    return () => {
      window.removeEventListener('examSubmitted', handleExamSubmitted);
    };
  }, [user]);

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

      {user ? (
        <div className="dashboard-container">
          {/* User Profile Section */}
          <div className="user-profile-section">
            <h2>User Profile</h2>
            <div className="user-info-card">
              <div className="user-avatar">
                {userData?.profilePicture ? (
                  <img src={userData.profilePicture} alt={userData.name} />
                ) : (
                  <div className="avatar-placeholder">{userData?.name?.charAt(0).toUpperCase()}</div>
                )}
              </div>
              <div className="user-details">
                <p><strong>Name:</strong> {userData?.name}</p>
                <p><strong>Email:</strong> {userData?.email}</p>
                <p><strong>College:</strong> {userData?.college}</p>
                <p><strong>Bio:</strong> {userData?.bio || "No bio added yet"}</p>
              </div>
            </div>
          </div>

          {/* Exam History Section */}
          <div className="exam-history-section">
            <h2>Exam History</h2>
            {userData?.marks && userData.marks.length > 0 ? (
              <div className="exam-cards">
                {userData.marks.map((exam, index) => (
                  <div key={index} className="exam-card">
                    <h3>{exam.examName}</h3>
                    <div className="exam-details">
                      <p><strong>Marks:</strong> {exam.marks}/{exam.totalMarks}</p>
                      <p><strong>Percentage:</strong> {exam.percentage}%</p>
                      <p><strong>Date:</strong> {new Date(exam.date).toLocaleDateString()}</p>
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
