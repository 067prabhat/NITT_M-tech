import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve token and userId from localStorage
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      // If no token or userId, redirect to login page
      navigate("/login");
      return;
    }

    // Fetch user data from the backend (optional - if user data is not already available)
    axios.get(`http://localhost:3001/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUser(res.data); // Assuming backend sends user data
        setCourses(res.data.courses); // Assuming courses are part of user data
      })
      .catch(err => {
        console.error("Error fetching user data", err);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {user ? (
        <div className="profile-card">
          <h2>User Profile</h2>
          <div className="profile-details">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role :</strong> {user.role}</p>
            <h3>Enrolled Courses:</h3>
            <ul>
              {courses.length > 0 ? (
                courses.map((course, index) => (
                  <li key={index}>{course}</li>
                ))
              ) : (
                <li>No courses enrolled yet.</li>
              )}
            </ul>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
