import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./courses.css";

const NewCourse = () => {
  const [courseData, setCourseData] = useState({ title: "", description: "", details: "", duration: "", fee: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:3001/api/newCourse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courseData),
    })
      .then(() => navigate("/"))
      .catch((err) => console.error("Error adding course:", err));
  };

  return (
    <div className="form-container"
      style={{marginTop: "80px",}}>
      <h2>Add a New Course</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={courseData.title} onChange={handleChange} required />
        <input type="text" name="description" placeholder="Description" value={courseData.description} onChange={handleChange} required />
        <textarea name="details" placeholder="Details" value={courseData.details} onChange={handleChange} required />
        <input type="number" name="duration" placeholder="Duration (Years)" value={courseData.duration} onChange={handleChange} required />
        <input type="number" name="fee" placeholder="Fee (in Rupees)" value={courseData.fee} onChange={handleChange} required />
        <button type="submit">Add Course</button>
      </form>
    </div>
  );
};

export default NewCourse;
