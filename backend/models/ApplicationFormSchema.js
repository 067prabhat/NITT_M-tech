const mongoose = require("mongoose");

const ApplicationFormSchema = new mongoose.Schema({
  // Personal Details
  fullName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  nationality: { type: String, required: true },
  aadhaarNumber: { type: String, required: true, unique: true },

  // Contact Information
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  currentAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  guardianContact: { type: String, required: true },

  // Parent/Guardian Details
  fathersName: { type: String, required: true },
  mothersName: { type: String, required: true },
  fathersOccupation: { type: String, required: true },
  mothersOccupation: { type: String, required: true },
  fathersContact: { type: String, required: true },
  mothersContact: { type: String, required: true },

  // Academic Details
  education: {
    tenth: {
      school: { type: String, required: true },
      board: { type: String, required: true },
      year: { type: Number, required: true },
      percentage: { type: Number, required: true },
    },
    twelfth: {
      school: { type: String, required: true },
      board: { type: String, required: true },
      year: { type: Number, required: true },
      percentage: { type: Number, required: true },
      stream: { type: String, required: true },
    },
    graduation: {
      college: { type: String, required: true },
      degree: { type: String, required: true },
      branch: { type: String, required: true },
      university: { type: String, required: true },
      year: { type: Number, required: true },
      cgpa: { type: Number, required: true },
    },
  },

  // Documents Upload
  documentType: { type: String, required: true },
  documentUpload: { type: String, required: true }, // Store file URL/path

  // Declaration
  agreement: { type: Boolean, required: true },
  signature: { type: String, required: true },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
});

const ApplicationForm = mongoose.model("ApplicationForm", ApplicationFormSchema);

module.exports = ApplicationForm;
