const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  details: { type: String },
  duration: { type: Number, required: true },
  fee: { type: Number, required: true },
  requirement: { type: String, required: true },
  contact: { type: String, required: true },
  applicationForm: [{ label: String, type: String }],
  contentAdmins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // New field
});

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
