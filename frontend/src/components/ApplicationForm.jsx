import React, { useState, useEffect } from "react";
import "./ApplicationForm.css"; // Import CSS
import axios from "axios";

const ApplicationForm = ({ courseId }) => {
  const [formFields, setFormFields] = useState([]); // Dynamic form fields
  const [educationFields, setEducationFields] = useState({
    tenth: false,
    twelth: false,
    ug: false,
    pg: false,
  }); // Education fields to include
  const [sections, setSections] = useState([]); // List of sections (predefined + new)
  const [formData, setFormData] = useState({}); // Form data
  const [errors, setErrors] = useState({}); // Validation errors

  // Fetch form structure for the selected course
  useEffect(() => {
    const fetchFormStructure = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/get-form-structure/${courseId}`);
        setFormFields(response.data.fields || []);
        setEducationFields(response.data.educationFields || {
          tenth: false,
          twelth: false,
          ug: false,
          pg: false,
        });
        setSections(response.data.sections || []);
      } catch (error) {
        console.error("Error fetching form structure:", error);
      }
    };

    fetchFormStructure();
  }, [courseId]);

  // Handle input changes
  const handleChange = (e, fieldName) => {
    setFormData({ ...formData, [fieldName]: e.target.value });
    // Clear errors when the user starts typing
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: "" });
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    // Validate personal details
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.email) newErrors.email = "Email is required";

    // Validate education fields
    if (educationFields.tenth && !formData.tenthSchool) newErrors.tenthSchool = "10th School name is required";
    if (educationFields.twelth && !formData.twelthSchool) newErrors.twelthSchool = "12th School name is required";
    if (educationFields.ug && !formData.ugCollege) newErrors.ugCollege = "UG College name is required";
    if (educationFields.pg && !formData.pgCollege) newErrors.pgCollege = "PG College name is required";

    // Validate new sections
    sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.required && !formData[field.name]) {
          newErrors[field.name] = `${field.label} is required`;
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill in all required fields.");
      return;
    }

    const studentId = "12345"; // Replace with actual student ID

    try {
      const response = await axios.post(
        "http://localhost:3001/api/submit-application",
        { courseId, studentId, formData, educationDetails: educationFields },
        { headers: { "Content-Type": "application/json" } }
      );

      alert(response.data.message || "Application submitted successfully!");
    } catch (error) {
      alert("Error submitting application. Try again.");
    }
  };

  // Render education section dynamically
  const renderEducationSection = () => {
    return (
      <div className="academic-details">
        {educationFields.tenth && (
          <div className="accordion-section">
            <h3>10th Details</h3>
            <input
              type="text"
              placeholder="School Name"
              value={formData.tenthSchool || ""}
              onChange={(e) => handleChange(e, "tenthSchool")}
            />
            {errors.tenthSchool && <span className="error">{errors.tenthSchool}</span>}
            <input
              type="text"
              placeholder="Board"
              value={formData.tenthBoard || ""}
              onChange={(e) => handleChange(e, "tenthBoard")}
            />
            <input
              type="number"
              placeholder="Year of Passing"
              value={formData.tenthYear || ""}
              onChange={(e) => handleChange(e, "tenthYear")}
            />
            <input
              type="number"
              placeholder="Percentage"
              value={formData.tenthPercentage || ""}
              onChange={(e) => handleChange(e, "tenthPercentage")}
            />
          </div>
        )}
        {educationFields.twelth && (
          <div className="accordion-section">
            <h3>12th Details</h3>
            <input
              type="text"
              placeholder="School Name"
              value={formData.twelthSchool || ""}
              onChange={(e) => handleChange(e, "twelthSchool")}
            />
            {errors.twelthSchool && <span className="error">{errors.twelthSchool}</span>}
            <input
              type="text"
              placeholder="Board"
              value={formData.twelthBoard || ""}
              onChange={(e) => handleChange(e, "twelthBoard")}
            />
            <input
              type="number"
              placeholder="Year of Passing"
              value={formData.twelthYear || ""}
              onChange={(e) => handleChange(e, "twelthYear")}
            />
            <input
              type="number"
              placeholder="Percentage"
              value={formData.twelthPercentage || ""}
              onChange={(e) => handleChange(e, "twelthPercentage")}
            />
            <input
              type="text"
              placeholder="Stream"
              value={formData.twelthStream || ""}
              onChange={(e) => handleChange(e, "twelthStream")}
            />
          </div>
        )}
        {educationFields.ug && (
          <div className="accordion-section">
            <h3>UG Details</h3>
            <input
              type="text"
              placeholder="College Name"
              value={formData.ugCollege || ""}
              onChange={(e) => handleChange(e, "ugCollege")}
            />
            {errors.ugCollege && <span className="error">{errors.ugCollege}</span>}
            <input
              type="text"
              placeholder="Degree"
              value={formData.ugDegree || ""}
              onChange={(e) => handleChange(e, "ugDegree")}
            />
            <input
              type="text"
              placeholder="Branch"
              value={formData.ugBranch || ""}
              onChange={(e) => handleChange(e, "ugBranch")}
            />
            <input
              type="text"
              placeholder="University"
              value={formData.ugUniversity || ""}
              onChange={(e) => handleChange(e, "ugUniversity")}
            />
            <input
              type="number"
              placeholder="Year of Passing"
              value={formData.ugYear || ""}
              onChange={(e) => handleChange(e, "ugYear")}
            />
            <input
              type="number"
              placeholder="CGPA"
              value={formData.ugCgpa || ""}
              onChange={(e) => handleChange(e, "ugCgpa")}
            />
          </div>
        )}
        {educationFields.pg && (
          <div className="accordion-section">
            <h3>PG Details</h3>
            <input
              type="text"
              placeholder="College Name"
              value={formData.pgCollege || ""}
              onChange={(e) => handleChange(e, "pgCollege")}
            />
            {errors.pgCollege && <span className="error">{errors.pgCollege}</span>}
            <input
              type="text"
              placeholder="Degree"
              value={formData.pgDegree || ""}
              onChange={(e) => handleChange(e, "pgDegree")}
            />
            <input
              type="text"
              placeholder="Branch"
              value={formData.pgBranch || ""}
              onChange={(e) => handleChange(e, "pgBranch")}
            />
            <input
              type="text"
              placeholder="University"
              value={formData.pgUniversity || ""}
              onChange={(e) => handleChange(e, "pgUniversity")}
            />
            <input
              type="number"
              placeholder="Year of Passing"
              value={formData.pgYear || ""}
              onChange={(e) => handleChange(e, "pgYear")}
            />
            <input
              type="number"
              placeholder="CGPA"
              value={formData.pgCgpa || ""}
              onChange={(e) => handleChange(e, "pgCgpa")}
            />
          </div>
        )}
      </div>
    );
  };

  // Render new sections dynamically
  const renderNewSections = () => {
    return sections.map((section, sectionIndex) => (
      <div key={sectionIndex}>
        <h3>{section.name}</h3>
        {section.fields.map((field, fieldIndex) => (
          <div key={fieldIndex}>
            <label>{field.label}</label>
            {field.type === "text" && (
              <input
                type="text"
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(e, field.name)}
                required={field.required}
              />
            )}
            {field.type === "number" && (
              <input
                type="number"
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(e, field.name)}
                required={field.required}
              />
            )}
            {field.type === "date" && (
              <input
                type="date"
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(e, field.name)}
                required={field.required}
              />
            )}
            {errors[field.name] && <span className="error">{errors[field.name]}</span>}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="application-form-container">
      <h2>Application Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Fixed Sections (Personal Details, Contact Information, etc.) */}
        <div className="personal-details">
          <h3>Personal Details</h3>
          <label>Full Name:</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName || ""}
            onChange={(e) => handleChange(e, "fullName")}
            required
          />
          {errors.fullName && <span className="error">{errors.fullName}</span>}
  
          <label>Date of Birth:</label>
          <input
            type="date"
            value={formData.dob || ""}
            onChange={(e) => handleChange(e, "dob")}
            required
          />
          {errors.dob && <span className="error">{errors.dob}</span>}
  
          <label>Gender:</label>
          <select
            value={formData.gender || ""}
            onChange={(e) => handleChange(e, "gender")}
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <span className="error">{errors.gender}</span>}
  
          <label>Nationality:</label>
          <input
            type="text"
            placeholder="Enter your nationality"
            value={formData.nationality || ""}
            onChange={(e) => handleChange(e, "nationality")}
            required
          />
          {errors.nationality && <span className="error">{errors.nationality}</span>}
  
          <label>Aadhaar Number:</label>
          <input
            type="text"
            placeholder="Enter Aadhaar Number"
            value={formData.aadhaarNumber || ""}
            onChange={(e) => handleChange(e, "aadhaarNumber")}
            required
          />
          {errors.aadhaarNumber && <span className="error">{errors.aadhaarNumber}</span>}
        </div>
  
        {/* Contact Information */}
        <div className="contact-information">
          <h3>Contact Information</h3>
          <label>Phone Number:</label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phoneNumber || ""}
            onChange={(e) => handleChange(e, "phoneNumber")}
            required
          />
          {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
  
          <label>Email Address:</label>
          <input
            type="email"
            placeholder="Enter your email address"
            value={formData.email || ""}
            onChange={(e) => handleChange(e, "email")}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
  
          <label>Current Address:</label>
          <textarea
            placeholder="Enter your current address"
            value={formData.currentAddress || ""}
            onChange={(e) => handleChange(e, "currentAddress")}
            required
          />
          {errors.currentAddress && <span className="error">{errors.currentAddress}</span>}
  
          <label>Permanent Address:</label>
          <textarea
            placeholder="Enter your permanent address"
            value={formData.permanentAddress || ""}
            onChange={(e) => handleChange(e, "permanentAddress")}
            required
          />
          {errors.permanentAddress && <span className="error">{errors.permanentAddress}</span>}
  
          <label>Guardian's Contact Number:</label>
          <input
            type="tel"
            placeholder="Enter guardian's phone number"
            value={formData.guardianContact || ""}
            onChange={(e) => handleChange(e, "guardianContact")}
            required
          />
          {errors.guardianContact && <span className="error">{errors.guardianContact}</span>}
        </div>
  
        {/* Parent/Guardian Details */}
        <div className="parent-details">
          <h3>Parent/Guardian Details</h3>
          <label>Father's Name:</label>
          <input
            type="text"
            placeholder="Enter father's name"
            value={formData.fathersName || ""}
            onChange={(e) => handleChange(e, "fathersName")}
            required
          />
          {errors.fathersName && <span className="error">{errors.fathersName}</span>}
  
          <label>Mother's Name:</label>
          <input
            type="text"
            placeholder="Enter mother's name"
            value={formData.mothersName || ""}
            onChange={(e) => handleChange(e, "mothersName")}
            required
          />
          {errors.mothersName && <span className="error">{errors.mothersName}</span>}
  
          <label>Father's Occupation:</label>
          <input
            type="text"
            placeholder="Enter father's occupation"
            value={formData.fathersOccupation || ""}
            onChange={(e) => handleChange(e, "fathersOccupation")}
            required
          />
          {errors.fathersOccupation && <span className="error">{errors.fathersOccupation}</span>}
  
          <label>Mother's Occupation:</label>
          <input
            type="text"
            placeholder="Enter mother's occupation"
            value={formData.mothersOccupation || ""}
            onChange={(e) => handleChange(e, "mothersOccupation")}
            required
          />
          {errors.mothersOccupation && <span className="error">{errors.mothersOccupation}</span>}
  
          <label>Father's Contact Number:</label>
          <input
            type="tel"
            placeholder="Enter father's phone number"
            value={formData.fathersContact || ""}
            onChange={(e) => handleChange(e, "fathersContact")}
            required
          />
          {errors.fathersContact && <span className="error">{errors.fathersContact}</span>}
  
          <label>Mother's Contact Number:</label>
          <input
            type="tel"
            placeholder="Enter mother's phone number"
            value={formData.mothersContact || ""}
            onChange={(e) => handleChange(e, "mothersContact")}
            required
          />
          {errors.mothersContact && <span className="error">{errors.mothersContact}</span>}
        </div>
  
        {/* Education Section */}
        {renderEducationSection()}
  
        {/* New Sections */}
        {renderNewSections()}
  
        {/* Declaration */}
        <div className="declaration">
          <h3>Declaration</h3>
          <label>
            <input
              type="checkbox"
              checked={formData.agreement || false}
              onChange={(e) => handleChange(e, "agreement")}
            />
            I agree to the terms and conditions
          </label>
          {errors.agreement && <span className="error">{errors.agreement}</span>}
  
          <label>Signature:</label>
          <input
            type="text"
            placeholder="Enter your signature"
            value={formData.signature || ""}
            onChange={(e) => handleChange(e, "signature")}
            required
          />
          {errors.signature && <span className="error">{errors.signature}</span>}
        </div>
  
        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ApplicationForm;
