import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./courses.css";

const NewCourse = () => {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    contentAdminName: "", 
    contentAdminEmail: "",  // Content admin email field
    //contentAdminPassword: "" // Content admin password field
    counsellingOfficerName:"",
    counsellingOfficerEmail:"",
  });

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        setUser(decodedUser);
      } catch (err) {
        console.error("Token decoding failed:", err);
        setUser(null);
      }
    }
  }, []);

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure only admins can add courses
    if (!user || user.role !== "admin") {
      alert("Access Denied: Only admins can add courses.");
      return;
    }
    

    const requestBody = {
      title: courseData.title,
      description: courseData.description,
      contentAdminName: courseData.contentAdminName,
      contentAdminEmail: courseData.contentAdminEmail,
      //contentAdminPassword: courseData.contentAdminPassword,
    };
    
    fetch("http://127.0.0.1:3001/api/newCourse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => {
        if (res.status === 401) throw new Error("Unauthorized. Please log in.");
        if (res.status === 403) throw new Error("Access denied. Admins only.");
        if (!res.ok) throw new Error("Something went wrong. Please try again.");
        return res.json();
      })
      .then(() => {
        alert("Course and content admin added successfully!");
        navigate("/");
      })
      .catch((err) => {
        console.error("Error adding course:", err);
        alert(err.message);
      });
  };

  return (
    <div className="form-container" style={{ marginTop: "80px" }}>
      <h2>Add a New Course</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={courseData.title} onChange={handleChange} required />
        <input type="text" name="description" placeholder="Description" value={courseData.description} onChange={handleChange} required />

        {/* 🔹 Add fields for Content Admin */}
        <h3>Assign Content Admin</h3>
        <input type="text" name="contentAdminName" placeholder="Content Admin Name" value={courseData.contentAdminName} onChange={handleChange} required />
        <input type="email" name="contentAdminEmail" placeholder="Content Admin Email" value={courseData.contentAdminEmail} onChange={handleChange} required />
        <button type="submit">Add Course</button>
      </form>
    </div>
  );
};

export default NewCourse;