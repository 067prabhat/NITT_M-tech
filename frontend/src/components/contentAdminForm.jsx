import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ContentAdminForm.css"; // Import CSS file

const ContentAdminForm = () => {
  const { courseId } = useParams();
  const [fields, setFields] = useState([]); // Dynamic form fields
  const [educationFields, setEducationFields] = useState({
    tenth: false,
    twelth: false,
    ug: false,
    pg: false,
  }); // Education fields to include
  const [newSectionName, setNewSectionName] = useState(""); // Name of new section
  const [newField, setNewField] = useState({ name: "", label: "", type: "text", required: false }); // New field to add
  const [sections, setSections] = useState([]); // List of sections (predefined + new)

  // Fetch existing form structure for the course
  useEffect(() => {
    const fetchFormStructure = async () => {
      try {
        const response = await axios.get(`/api/get-form-structure/${courseId}`);
        if (response.data) {
          setFields(response.data.fields || []);
          setEducationFields(response.data.educationFields || {
            tenth: false,
            twelth: false,
            ug: false,
            pg: false,
          });
          setSections(response.data.sections || []);
        }
      } catch (error) {
        console.error("Error fetching form structure:", error);
      }
    };

    fetchFormStructure();
  }, [courseId]);

  // Add a new field to the form
  const addField = () => {
    if (!newField.name || !newField.label) {
      alert("Please fill in the field name and label.");
      return;
    }
    setFields([...fields, newField]);
    setNewField({ name: "", label: "", type: "text", required: false }); // Reset form
  };

  // Remove a field from the form
  const removeField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  // Add a new section
  const addSection = () => {
    if (!newSectionName) {
      alert("Please enter a section name.");
      return;
    }
    setSections([...sections, { name: newSectionName, fields: [] }]);
    setNewSectionName("");
  };

  // Add a new field to a section
  const addFieldToSection = (sectionIndex) => {
    if (!newField.name) {
      alert("Please enter a field name.");
      return;
    }
    const updatedSections = [...sections];
    updatedSections[sectionIndex].fields.push(newField);
    setSections(updatedSections);
    setNewField({ name: "", label: "", type: "text", required: false });
  };

  // Save the form structure to the backend
  const saveForm = async () => {
    try {
      console.log("working here")
      await axios.post("/api/save-form-structure", {
        courseId,
        fields,
        educationFields,
        sections,
      });
      alert("Form saved successfully!");
    } catch (error) {
      console.error("Error saving form:", error);
      alert("Failed to save form.");
    }
  };

  return (
    <div className="content-admin-form">
      <h2>Manage Application Form</h2>

      {/* Configure Education Section */}
      <div className="education-section">
        <h3>Configure Education Section</h3>
        <label>
          <input
            type="checkbox"
            checked={educationFields.tenth}
            onChange={(e) => setEducationFields({ ...educationFields, tenth: e.target.checked })}
          />
          10th Details
        </label>
        <label>
          <input
            type="checkbox"
            checked={educationFields.twelth}
            onChange={(e) => setEducationFields({ ...educationFields, twelth: e.target.checked })}
          />
          12th Details
        </label>
        <label>
          <input
            type="checkbox"
            checked={educationFields.ug}
            onChange={(e) => setEducationFields({ ...educationFields, ug: e.target.checked })}
          />
          UG Details
        </label>
        <label>
          <input
            type="checkbox"
            checked={educationFields.pg}
            onChange={(e) => setEducationFields({ ...educationFields, pg: e.target.checked })}
          />
          PG Details
        </label>
      </div>

      {/* Add New Section */}
      <div className="add-section">
        <h3>Add New Section</h3>
        <input
          type="text"
          placeholder="Section Name"
          value={newSectionName}
          onChange={(e) => setNewSectionName(e.target.value)}
        />
        <button className="add-section-btn" onClick={addSection}>Add Section</button>
      </div>

      {/* Add Fields to Sections */}
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="section">
          <h4>{section.name}</h4>
          <div className="add-field-section">
            <input
              type="text"
              placeholder="Field Name"
              value={newField.name}
              onChange={(e) => setNewField({ ...newField, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Field Label"
              value={newField.label}
              onChange={(e) => setNewField({ ...newField, label: e.target.value })}
            />
            <select
              value={newField.type}
              onChange={(e) => setNewField({ ...newField, type: e.target.value })}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="dropdown">Dropdown</option>
            </select>
            <label>
              Required:
              <input
                type="checkbox"
                checked={newField.required}
                onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
              />
            </label>
            <button className="add-field-btn" onClick={() => addFieldToSection(sectionIndex)}>Add Field</button>
          </div>

          {/* List of Fields in Section */}
          <div className="existing-fields-section">
            {section.fields.map((field, fieldIndex) => (
              <div key={fieldIndex} className="form-field">
                <input
                  type="text"
                  placeholder="Field Label"
                  value={field.label}
                  onChange={(e) => {
                    const updatedSections = [...sections];
                    updatedSections[sectionIndex].fields[fieldIndex].label = e.target.value;
                    setSections(updatedSections);
                  }}
                />
                <select
                  value={field.type}
                  onChange={(e) => {
                    const updatedSections = [...sections];
                    updatedSections[sectionIndex].fields[fieldIndex].type = e.target.value;
                    setSections(updatedSections);
                  }}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="dropdown">Dropdown</option>
                </select>
                <label>
                  Required:
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => {
                      const updatedSections = [...sections];
                      updatedSections[sectionIndex].fields[fieldIndex].required = e.target.checked;
                      setSections(updatedSections);
                    }}
                  />
                </label>
                <button className="remove-field-btn" onClick={() => {
                  const updatedSections = [...sections];
                  updatedSections[sectionIndex].fields.splice(fieldIndex, 1);
                  setSections(updatedSections);
                }}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Add New Field Section */}
      <div className="add-field-section">
        <h3>Add New Field</h3>
        <input
          type="text"
          placeholder="Field Name (e.g., fullName)"
          value={newField.name}
          onChange={(e) => setNewField({ ...newField, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Field Label (e.g., Full Name)"
          value={newField.label}
          onChange={(e) => setNewField({ ...newField, label: e.target.value })}
        />
        <select
          value={newField.type}
          onChange={(e) => setNewField({ ...newField, type: e.target.value })}
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
          <option value="dropdown">Dropdown</option>
        </select>
        <label>
          Required:
          <input
            type="checkbox"
            checked={newField.required}
            onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
          />
        </label>
        <button className="add-field-btn" onClick={addField}>Add Field</button>
      </div>

      {/* List of Existing Fields */}
      <div className="existing-fields-section">
        <h3>Existing Fields</h3>
        {fields.length > 0 ? (
          fields.map((field, index) => (
            <div key={index} className="form-field">
              <input
                type="text"
                placeholder="Field Label"
                value={field.label}
                onChange={(e) => {
                  const newFields = [...fields];
                  newFields[index].label = e.target.value;
                  setFields(newFields);
                }}
              />
              <select
                value={field.type}
                onChange={(e) => {
                  const newFields = [...fields];
                  newFields[index].type = e.target.value;
                  setFields(newFields);
                }}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="dropdown">Dropdown</option>
              </select>
              <label>
                Required:
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => {
                    const newFields = [...fields];
                    newFields[index].required = e.target.checked;
                    setFields(newFields);
                  }}
                />
              </label>
              <button className="remove-field-btn" onClick={() => removeField(index)}>Remove</button>
            </div>
          ))
        ) : (
          <p>No fields added yet.</p>
        )}
      </div>

      {/* Save Form Button */}
      <button className="save-form-btn" onClick={saveForm}>Save Form</button>
    </div>
  );
};

export default ContentAdminForm;
