import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./contentAdminDescription.css";

const ContentAdminDescription = () => {
  const { courseId } = useParams();
  const [programDescription, setProgramDescription] = useState("");
  const [image1, setImage1] = useState(null); // First image
  const [image2, setImage2] = useState(null); // Second image
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [yearsOfDepartment, setYearsOfDepartment] = useState("");
  const [syllabus, setSyllabus] = useState([{ semester: "", subjects: [] }]);
  const [programEducationalObjectives, setProgramEducationalObjectives] = useState("");
  const [programOutcomes, setProgramOutcomes] = useState("");

  // Handle image upload for the first image
  const handleImage1Upload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage1(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload for the second image
  const handleImage2Upload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage2(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSyllabusSemester = () => {
    setSyllabus([...syllabus, { semester: "", subjects: [] }]);
  };

  const handleSyllabusChange = (index, field, value) => {
    const updatedSyllabus = [...syllabus];
    updatedSyllabus[index][field] = value;
    setSyllabus(updatedSyllabus);
  };

  const addSubject = (index) => {
    const updatedSyllabus = [...syllabus];
    updatedSyllabus[index].subjects.push("");
    setSyllabus(updatedSyllabus);
  };

  const handleSubjectChange = (semesterIndex, subjectIndex, value) => {
    const updatedSyllabus = [...syllabus];
    updatedSyllabus[semesterIndex].subjects[subjectIndex] = value;
    setSyllabus(updatedSyllabus);
  };

  const saveDescription = () => {
    if (!image1 || !image2) {
      alert("Please upload both images.");
      return;
    }

    const courseData = {
      programDescription,
      image1,
      image2,
      vision,
      mission,
      yearsOfDepartment,
      syllabus,
      programEducationalObjectives: programEducationalObjectives.split("\n"),
      programOutcomes: programOutcomes.split("\n"),
    };
    const token = localStorage.getItem("token");
    axios
    .post(`http://127.0.0.1:3001/api/courses/${courseId}/add-description`, courseData, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the JWT token in the request headers
      },
    })
    .then((response) => {
      alert(response.data.message || "Description saved successfully!");
    })
    .catch((error) => {
      console.error("Error adding program description:", error);
      alert(error.response?.data?.error || "Failed to save description. Please try again.");
    });
};

  return (
    <div className="content-admin-description">
      <h2>Add Program Description</h2>

      <div className="form-group">
        <label>Program Description</label>
        <textarea
          placeholder="Enter program description..."
          value={programDescription}
          onChange={(e) => setProgramDescription(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Upload Image 1</label>
        <input type="file" accept="image/*" onChange={handleImage1Upload} />
        {image1 && <img src={image1} alt="Uploaded Image 1" className="uploaded-image" />}
      </div>

      <div className="form-group">
        <label>Upload Image 2</label>
        <input type="file" accept="image/*" onChange={handleImage2Upload} />
        {image2 && <img src={image2} alt="Uploaded Image 2" className="uploaded-image" />}
      </div>

      <div className="form-group">
        <label>Vision</label>
        <textarea
          placeholder="Enter vision..."
          value={vision}
          onChange={(e) => setVision(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Mission</label>
        <textarea
          placeholder="Enter mission..."
          value={mission}
          onChange={(e) => setMission(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Years of Department</label>
        <input
          type="number"
          placeholder="Enter years of department..."
          value={yearsOfDepartment}
          onChange={(e) => setYearsOfDepartment(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Syllabus</label>
        {syllabus.map((semester, index) => (
          <div key={index} className="syllabus-semester">
            <input
              type="text"
              placeholder="Semester (e.g., Semester 1)"
              value={semester.semester}
              onChange={(e) => handleSyllabusChange(index, "semester", e.target.value)}
              required
            />
            {semester.subjects.map((subject, subjectIndex) => (
              <input
                key={subjectIndex}
                type="text"
                placeholder={`Subject ${subjectIndex + 1}`}
                value={subject}
                onChange={(e) => handleSubjectChange(index, subjectIndex, e.target.value)}
                required
              />
            ))}
            <button onClick={() => addSubject(index)}>Add Subject</button>
          </div>
        ))}
        <button onClick={addSyllabusSemester}>Add Semester</button>
      </div>

      <div className="form-group">
        <label>Program Educational Objectives (PEOs)</label>
        <textarea
          placeholder="Enter PEOs (one per line)..."
          value={programEducationalObjectives}
          onChange={(e) => setProgramEducationalObjectives(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Program Outcomes (POs)</label>
        <textarea
          placeholder="Enter POs (one per line)..."
          value={programOutcomes}
          onChange={(e) => setProgramOutcomes(e.target.value)}
          required
        />
      </div>

      <button className="save-button" onClick={saveDescription}>
        Save Description
      </button>
    </div>
  );
};

export default ContentAdminDescription;

