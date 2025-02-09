const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  details: { type: String }, // Optional details
  duration: { type: Number, required: true }, // Duration in years
  fee: { type: Number, required: true },      // Fee in Rupees
  requirement: {type: String, required: true},
  contact: {type: String, required: true}
});

const CourseModel = mongoose.model("Course", CourseSchema);
module.exports = CourseModel;
