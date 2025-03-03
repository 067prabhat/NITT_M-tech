import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const loadUser = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (err) {
        console.error("Token decoding failed:", err);
        setUser(null);
        localStorage.removeItem("token");
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser(); // Load user when component mounts

    // Listen for changes in localStorage (for real-time login/logout update)
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const handleDashboardRedirect = () => {
    if (user?.role === "admin") {
      navigate("/Admindashboard");
    } else if (user?.role === "content_admin") {
      navigate("/contentAdmin");
    } else if (user?.role === "student") {
      navigate("/dashboard");
    }
  };

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
      </ul>

      <div className="navbar-search">
        <input type="text" placeholder="Search..." />
        <button>Search</button>
      </div>

      {/* Dashboard & Logout Buttons in One Line */}
      {user ? (
        <div className="navbar-actions">
          <button onClick={handleDashboardRedirect} className="dashboard-btn">
            Dashboard
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login" className="login-link">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;
