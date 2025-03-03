import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ContentAdminDescription.css"; // Import CSS file

const ContentAdminDescription = () => {
  const { courseId } = useParams();
  const [description, setDescription] = useState("");

  const saveDescription = () => {
    axios
      .post(`/api/courses/${courseId}/add-description`, { description })
      .then(() => alert("Description added successfully!"))
      .catch((err) => console.error("Error adding description:", err));
  };

  return (
    <div className="content-admin-description">
      <h2>Add Course Description</h2>
      <textarea
        placeholder="Enter course description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <button className="save-description-btn" onClick={saveDescription}>
        Save Description
      </button>
    </div>
  );
};

export default ContentAdminDescription;

