const express = require("express");
const router = express.Router();
const Form = require("../models/Form");
const ApplicationForm = require("../models/ApplicationForm");
const Course = require("../models/Course");
const { auth, authorize } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

// ✅ Save or update form structure (Only Content Admin)
router.post(
  "api/save-form-structure", // Relative to /api/forms
  auth,
  authorize(["content_admin"]),
  [
    body("courseId").notEmpty().withMessage("Course ID is required"),
    body("fields").isArray().withMessage("Fields must be an array"),
    body("educationFields").isObject().withMessage("Education fields must be an object"),
    body("sections").isArray().withMessage("Sections must be an array"),
  ],
  async (req, res) => {
    try {
      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { courseId, fields, educationFields, sections } = req.body;

      // Check if the course exists
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Save or update the form structure
      const existingForm = await Form.findOne({ courseId });

      if (existingForm) {
        existingForm.fields = fields;
        existingForm.educationFields = educationFields;
        existingForm.sections = sections;
        existingForm.createdBy = req.user.userId;
        await existingForm.save();
        return res.status(200).json({ message: "Form structure updated successfully", form: existingForm });
      } else {
        const newForm = new Form({ courseId, fields, educationFields, sections, createdBy: req.user.userId });
        await newForm.save();
        return res.status(201).json({ message: "Form structure created successfully", form: newForm });
      }
    } catch (error) {
      console.error("Error saving form structure:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ✅ Get form structure for students
router.get("/get-form-structure/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Fetch the form structure
    const form = await Form.findOne({ courseId });
    if (!form) {
      return res.status(404).json({ error: "Form structure not found" });
    }

    res.status(200).json({ fields: form.fields, educationFields: form.educationFields, sections: form.sections });
  } catch (error) {
    console.error("Error fetching form structure:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Submit application (Only authenticated students)
router.post(
  "/submit-application", // Relative to /api/forms
  auth,
  authorize(["student"]),
  [
    body("courseId").notEmpty().withMessage("Course ID is required"),
    body("studentId").notEmpty().withMessage("Student ID is required"),
    body("formData").isObject().withMessage("Form data must be an object"),
    body("educationDetails").isObject().withMessage("Education details must be an object"),
  ],
  async (req, res) => {
    try {
      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { courseId, studentId, formData, educationDetails } = req.body;

      // Check if the course exists
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Save the application
      const application = new ApplicationForm({ courseId, studentId, formData, educationDetails });
      await application.save();

      res.status(201).json({ message: "Application submitted successfully" });
    } catch (error) {
      console.error("Error submitting application:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ✅ Get submitted application for a student
router.get("/get-application/:studentId/:courseId", auth, async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Fetch the application
    const application = await ApplicationForm.findOne({ studentId, courseId });
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Update course description (Only Content Admin)
router.put(
  "/update-course/:courseId", // Relative to /api/forms
  auth,
  authorize(["content_admin"]),
  [body("description").notEmpty().withMessage("Description is required")],
  async (req, res) => {
    try {
      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { courseId } = req.params;
      const { description } = req.body;

      // Update the course description
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        { description },
        { new: true }
      );

      if (!updatedCourse) {
        return res.status(404).json({ error: "Course not found" });
      }

      res.status(200).json({ message: "Course description updated", course: updatedCourse });
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ✅ Get course details including description (For Content Admin)
router.get("/course/:courseId", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;