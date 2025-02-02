const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  details: String,
  duration: Number,  // Duration in years
  fee: Number,       // Fee in Rupees
});

const CourseModel = mongoose.model("Course", CourseSchema);
module.exports = CourseModel;
