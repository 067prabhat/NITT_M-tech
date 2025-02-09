import React, { useState , useEffect} from "react";
import "./ApplicationForm.css"; // Import CSS file
import axios from "axios";
const ApplicationForm = () => {
  const sections = [
    "Personal Details",
    "Contact Information",
    "Parent/Guardian Details",
    "Academic Details",
    "Documents Upload",
    "Declaration",
  ];

  const [formData, setFormData] = useState({
    school10: "",
    board10: "",
    year10: "",
    percentage10: "",
    school12: "",
    board12: "",
    year12: "",
    percentage12: "",
    stream12: "",
    collegeGrad: "",
    degreeGrad: "",
    branchGrad: "",
    universityGrad: "",
    yearGrad: "",
    cgpaGrad: "",
  });

  const [educationDetails, setEducationDetails] = useState({
    "10th": [],
    "12th": [],
    graduation: [],
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState({});
  const [openAccordion, setOpenAccordion] = useState(null);

  const [errors, setErrors] = useState({});


  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token"); // Ensure user is authenticated
      const headers = token ? { Authorization: `Bearer ${token}` } : {}; 
  
      const response = await axios.post(
        "http://127.0.0.1:3001/api/application",
        formData, 
        { headers }
      );
  
      alert(response.data.message);
    } catch (error) {
      alert("Error submitting application. Try again.");
    }
  };


  const handleSectionClick = (index) => {
    if (index === activeIndex + 1) {
      // Mark the previous section as completed
      setCompletedSections((prev) => {
        const updatedSections = { ...prev };
        updatedSections[activeIndex] = true; // Mark current section as completed
        return updatedSections;
      });
    }
    setActiveIndex(index);
  };

  const validateSection = () => {
    const sectionErrors = {};
    switch (activeIndex) {
      case 0: // Personal Details
        if (!formData.fullName) sectionErrors.fullName = "Full name is required";
        if (!formData.dob) sectionErrors.dob = "Date of birth is required";
        if (!formData.gender) sectionErrors.gender = "Gender is required";
        if (!formData.nationality) sectionErrors.nationality = "Nationality is required";
        if (!formData.aadhaarNumber) sectionErrors.aadhaarNumber = "Aadhaar number is required";
        break;
      case 1: // Contact Information
        if (!formData.phoneNumber) sectionErrors.phoneNumber = "Phone number is required";
        if (!formData.email) sectionErrors.email = "Email is required";
        if (!formData.currentAddress) sectionErrors.currentAddress = "Current address is required";
        if (!formData.permanentAddress) sectionErrors.permanentAddress = "Permanent address is required";
        if (!formData.guardianContact) sectionErrors.guardianContact = "Guardian's contact number is required";
        break;
      case 2: // Parent/Guardian Details
        if (!formData.fathersName) sectionErrors.fathersName = "Father's name is required";
        if (!formData.mothersName) sectionErrors.mothersName = "Mother's name is required";
        if (!formData.fathersOccupation) sectionErrors.fathersOccupation = "Father's occupation is required";
        if (!formData.mothersOccupation) sectionErrors.mothersOccupation = "Mother's occupation is required";
        if (!formData.fathersContact) sectionErrors.fathersContact = "Father's contact number is required";
        if (!formData.mothersContact) sectionErrors.mothersContact = "Mother's contact number is required";
        if (!formData.guardianContact) sectionErrors.guardianContact = "Guardian's contact number is required";
        break;
      case 3: // Academic Details
        const academicErrors = [];
        if (educationDetails["10th"].length === 0) academicErrors.push("Please provide details for 10th education.");
        if (educationDetails["12th"].length === 0) academicErrors.push("Please provide details for 12th education.");
        if (educationDetails["graduation"].length === 0) academicErrors.push("Please provide details for Graduation.");
        if (academicErrors.length > 0) sectionErrors.academicDetails = academicErrors;
        break;
      case 4: // Documents Upload
        if (!formData.documentType) sectionErrors.documentType = "Document type is required";
        if (!formData.documentUpload) sectionErrors.documentUpload = "Document upload is required";
        break;
      case 5: // Declaration
        if (!formData.agreement) sectionErrors.agreement = "You must agree to the terms and conditions";
        if (!formData.signature) sectionErrors.signature = "Signature is required";
        break;
      default:
        break;
    }

    setErrors(sectionErrors);
    return Object.keys(sectionErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection()) {
      if (activeIndex < sections.length - 1) {
        setActiveIndex(activeIndex + 1);
      }
    }
  };

  const handleBack = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const toggleAccordion = (section, e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event propagation
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const isAccordionOpen = (section) => {
    return openAccordion === section;
  };

  const handleInputChange = (e, level, index) => {
    const { name, value } = e.target;
    const updatedDetails = educationDetails[level].map((entry, i) => {
      if (i === index) {
        return { ...entry, [name]: value };
      }
      return entry;
    });
    setEducationDetails({ ...educationDetails, [level]: updatedDetails });
  };

  const handleAddEducation = (level) => {
    setEducationDetails({
      ...educationDetails,
      [level]: [
        ...educationDetails[level],
        {
          school: "",
          board: "",
          year: "",
          percentage: "",
          stream: "",
          college: "",
          degree: "",
          university: "",
          cgpa: "",
        },
      ],
    });
  };

  const handleRemoveEducation = (level, index) => {
    const updatedDetails = educationDetails[level].filter((_, i) => i !== index);
    setEducationDetails({
      ...educationDetails,
      [level]: updatedDetails,
    });
  };
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Student Registration</h3>
        <ul>
          {sections.map((section, index) => (
            <li
              key={section}
              className={activeIndex === index ? "active" : ""}
              onClick={() => handleSectionClick(index)}
            >
              {section} {completedSections[index] && "☑"}
            </li>
          ))}
        </ul>
      </div>

      {/* Form Content */}
      <div className="form-container">
        <h2>{sections[activeIndex]}</h2>
        <form>
          {activeIndex === 0 && (
            <div className="personal-details">
              <label>Full Name:</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName || ""}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
              {errors.fullName && <span className="error">{errors.fullName}</span>}

              <label>Date of Birth:</label>
              <input
                type="date"
                value={formData.dob || ""}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                required
              />
              {errors.dob && <span className="error">{errors.dob}</span>}

              <label>Gender:</label>
              <select
                value={formData.gender || ""}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                required
              />
              {errors.nationality && <span className="error">{errors.nationality}</span>}

              <label>Aadhaar Number:</label>
              <input
                type="text"
                placeholder="Enter Aadhaar Number"
                value={formData.aadhaarNumber || ""}
                onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                required
              />
              {errors.aadhaarNumber && <span className="error">{errors.aadhaarNumber}</span>}
            </div>
          )}

          {activeIndex === 1 && (
            <div className="contact-information">
              <label>Phone Number:</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber || ""}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
              />
              {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}

              <label>Email Address:</label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              {errors.email && <span className="error">{errors.email}</span>}

              <label>Current Address:</label>
              <textarea
                placeholder="Enter your current address"
                value={formData.currentAddress || ""}
                onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                required
              />
              {errors.currentAddress && <span className="error">{errors.currentAddress}</span>}

              <label>Permanent Address:</label>
              <textarea
                placeholder="Enter your permanent address"
                value={formData.permanentAddress || ""}
                onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                required
              />
              {errors.permanentAddress && <span className="error">{errors.permanentAddress}</span>}

              <label>Guardian's Contact Number:</label>
              <input
                type="tel"
                placeholder="Enter guardian's phone number"
                value={formData.guardianContact || ""}
                onChange={(e) => setFormData({ ...formData, guardianContact: e.target.value })}
                required
              />
              {errors.guardianContact && <span className="error">{errors.guardianContact}</span>}
            </div>
          )}

          {/* Parent/Guardian Details */}
          {activeIndex === 2 && (
            <div className="parent-details">
              <label>Father's Name:</label>
              <input
                type="text"
                placeholder="Enter father's name"
                value={formData.fathersName || ""}
                onChange={(e) => setFormData({ ...formData, fathersName: e.target.value })}
                required
              />
              {errors.fathersName && <span className="error">{errors.fathersName}</span>}

              <label>Mother's Name:</label>
              <input
                type="text"
                placeholder="Enter mother's name"
                value={formData.mothersName || ""}
                onChange={(e) => setFormData({ ...formData, mothersName: e.target.value })}
                required
              />
              {errors.mothersName && <span className="error">{errors.mothersName}</span>}

              <label>Father's Occupation:</label>
              <input
                type="text"
                placeholder="Enter father's occupation"
                value={formData.fathersOccupation || ""}
                onChange={(e) => setFormData({ ...formData, fathersOccupation: e.target.value })}
                required
              />
              {errors.fathersOccupation && <span className="error">{errors.fathersOccupation}</span>}

              <label>Mother's Occupation:</label>
              <input
                type="text"
                placeholder="Enter mother's occupation"
                value={formData.mothersOccupation || ""}
                onChange={(e) => setFormData({ ...formData, mothersOccupation: e.target.value })}
                required
              />
              {errors.mothersOccupation && <span className="error">{errors.mothersOccupation}</span>}

              <label>Father's Contact Number:</label>
              <input
                type="tel"
                placeholder="Enter father's phone number"
                value={formData.fathersContact || ""}
                onChange={(e) => setFormData({ ...formData, fathersContact: e.target.value })}
                required
              />
              {errors.fathersContact && <span className="error">{errors.fathersContact}</span>}

              <label>Mother's Contact Number:</label>
              <input
                type="tel"
                placeholder="Enter mother's phone number"
                value={formData.mothersContact || ""}
                onChange={(e) => setFormData({ ...formData, mothersContact: e.target.value })}
                required
              />
              {errors.mothersContact && <span className="error">{errors.mothersContact}</span>}
            </div>
          )}

          {/* Documents Upload */}
          {activeIndex === 4 && (
            <div className="document-upload">
              <label htmlFor="document-type">Document Type:</label>
              <select
                id="document-type"
                value={formData.documentType || ""}
                onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                required
              >
                <option value="">Select document type</option>
                <option value="passport">Passport</option>
                <option value="license">Driver's License</option>
                <option value="id-card">ID Card</option>
                <option value="birth-certificate">Birth Certificate</option>
              </select>
              {errors.documentType && <span className="error">{errors.documentType}</span>}

              <label>Upload Document:</label>
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, documentUpload: e.target.files[0] })}
                required
              />
              {errors.documentUpload && <span className="error">{errors.documentUpload}</span>}
            </div>
          )}

          {/* Declaration */}
          {activeIndex === 5 && (
            <div className="declaration">
              <label>
                <input
                  type="checkbox"
                  checked={formData.agreement || false}
                  onChange={(e) => setFormData({ ...formData, agreement: e.target.checked })}
                />
                I agree to the terms and conditions
              </label>
              {errors.agreement && <span className="error">{errors.agreement}</span>}

              <label>Signature:</label>
              <input
                type="text"
                placeholder="Enter your signature"
                value={formData.signature || ""}
                onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                required
              />
              {errors.signature && <span className="error">{errors.signature}</span>}
            </div>
          )}

          <div className="form-navigation">
            <button type="button" onClick={handleBack} disabled={activeIndex === 0}>
              Back
            </button>
            <button 
        type="button" 
        onClick={activeIndex === sections.length - 1 ? handleSubmit : handleNext}
    >
        {activeIndex === sections.length - 1 ? "Submit" : "Next"}
    </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
