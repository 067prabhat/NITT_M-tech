import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null); // Store error message
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      console.log("No token or userId found, redirecting to login...");
      navigate("/login");
      return;
    }

    console.log(`Fetching user data for ID: ${userId}`);

    axios
      .get(`http://localhost:3001/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("User data received:", res.data);
        setUser(res.data);
        setCourses(res.data.courses || []);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err.response?.data || err.message);
        setError("Failed to load user data. Please try again later.");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {error ? (
        <p style={{ color: "red", fontSize: "18px" }}>{error}</p>
      ) : user ? (
        <div className="profile-card">
          <h2>User Profile</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <h3>Enrolled Courses:</h3>
          <ul>
            {courses.length > 0 ? (
              courses.map((course, index) => <li key={index}>{course}</li>)
            ) : (
              <li>No courses enrolled yet.</li>
            )}
          </ul>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
