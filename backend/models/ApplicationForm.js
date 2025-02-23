const mongoose = require("mongoose");

const ApplicationFormSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course ID is required"],
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student ID is required"],
    },
    formData: {
      type: mongoose.Schema.Types.Mixed, // Allows flexible data structures
      required: [true, "Form data is required"],
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Indexes for faster queries
ApplicationFormSchema.index({ courseId: 1 });
ApplicationFormSchema.index({ studentId: 1 });

const ApplicationForm = mongoose.model("ApplicationForm", ApplicationFormSchema);
module.exports = ApplicationForm;

