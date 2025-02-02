import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as jwt_decode from "jwt-decode"; // Correct import
import "./Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode the token to get user data
        const decodedUser = jwt_decode(token);
        setUser(decodedUser); // Set the user data in the state
      } catch (err) {
        console.error("Token decoding failed:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token on logout
    setUser(null); // Clear the user state
    navigate("/"); // Redirect to the home page or login page
  };

  const handleDashboardRedirect = () => {
    if (user?.role === "admin") {
      navigate("/Admindashboard"); // Admin Dashboard
    } else if (user?.role === "student") {
      navigate("/dashboard"); // Student Dashboard
    }
  };

  console.log(user);  // Debugging: Check the user object

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/images/nitt.png" alt="NITT Logo" />
        NIT Trichy E-Campus
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/courses">Courses</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/payment">Payment</Link></li>
        {/* Conditionally render the Dashboard link based on user role */}
        
        {user && (
          <li><Link to="#" onClick={handleDashboardRedirect}>Dashboard</Link></li>
        )}
        {user ? (
          <>
            <li><Link to="/profile">{user.email}</Link></li> {/* Display user's email */}
            <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li> // Show login option if no user
        )}
      </ul>
      <div className="navbar-search">
        <input type="text" placeholder="Search..." />
        <button>Search</button>
      </div>
    </nav>
  );
};

export default Navbar;
