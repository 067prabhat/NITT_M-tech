const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  fee: { type: Number, required: true },
  contact: { type: String, required: true },
  requirement: { type: String, required: true },
  programDescription: { type: String }, // Program Description
  image1: { type: String }, // First image (as a URL or base64 string)
  image2: { type: String }, // Second image (as a URL or base64 string)
  vision: { type: String }, // Vision
  mission: { type: String }, // Mission
  yearsOfDepartment: { type: Number }, // Years of Department
  syllabus: [
    {
      semester: { type: String }, // Semester (e.g., "Semester 1")
      subjects: [{ type: String }], // List of subjects
    },
  ],
  programEducationalObjectives: [{ type: String }], // PEOs
  programOutcomes: [{ type: String }], // POs
});

module.exports = mongoose.model("Course", courseSchema,"courses");