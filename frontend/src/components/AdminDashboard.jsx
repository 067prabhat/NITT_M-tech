import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/authContext";
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (currentUser) {
          console.log("Fetching user details for:", currentUser.userId);
          const res = await axios.get(`http://localhost:3001/api/users/${currentUser.userId}`, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          });
          console.log("Admin Details:", res.data);
          setUsers([res.data]); // Store admin details
        }
      } catch (err) {
        console.error("Error fetching admin details:", err);
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };
  
    if (currentUser) {
      fetchUserDetails();
    } else {
      setError("Please log in first.");
      setLoading(false);
    }
  }, [currentUser]);
  

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3001/api/users/${userId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(users.filter(user => user._id !== userId));
      alert("User deleted successfully");
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-profile">
        <h2>Welcome, {currentUser.name}</h2>
        <p>Email: {currentUser.email}</p>
        <p>Role: {currentUser.role}</p>
      </div>

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}
        
        <h3>Registered Users</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Purchased Courses</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.courses ? user.courses.join(", ") : "None"}</td>
                  <td>
                    <Link to={`/user/${user._id}`} className="btn btn-info">View</Link>
                    <button className="btn btn-danger" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
