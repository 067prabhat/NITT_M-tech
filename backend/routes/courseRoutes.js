const express = require("express");
const CourseModel = require("../models/Course");
const { authenticate, authorizeAdmin } = require("../middleware/auth");

const router = express.Router();

// Fetch all courses
router.get("/", async (req, res) => {
  try {
    const courses = await CourseModel.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses" });
  }
});

// Admin Adds a Course
router.post("/new", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const newCourse = await CourseModel.create(req.body);
    res.status(201).json({ message: "Course added successfully", course: newCourse });
  } catch (error) {
    res.status(500).json({ message: "Error adding course" });
  }
});

module.exports = router;
