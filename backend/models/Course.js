const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  details: { type: String }, // Course description
  duration: { type: Number, required: true },
  fee: { type: Number, required: true },
  requirement: { type: String, required: true },
  contact: { type: String, required: true },
  applicationForm: [{ label: String, type: String }], // New field for form fields
});

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;

