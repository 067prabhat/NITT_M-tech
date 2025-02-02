import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/authContext";
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const { currentUser } = useAuth();  // Get currentUser from context

  useEffect(() => {
    // Fetch users only if the logged-in user is an admin
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:3001/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    // Only fetch users if admin is logged in
    if (currentUser && localStorage.getItem("role") === "admin") {
      fetchUsers();
    }
  }, [currentUser]);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Welcome Admin</h2>
        <p>Manage the platform from here</p>
      </div>

      <div className="dashboard-content">
        <div className="user-list">
          <h3>Registered Users</h3>
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
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
                    <td>
                      <Link to={`/user/${user._id}`} className="btn btn-info">View</Link>
                      <button className="btn btn-danger">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="dashboard-actions">
          <Link to="/add-user" className="btn btn-success">Add New User</Link>
          <Link to="/settings" className="btn btn-warning">Settings</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
