const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const FormDataModel = require("./models/FormData");
const CourseModel = require("./models/Course");
const ApplicationForm = require("./models/ApplicationFormSchema");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
  })
);

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Middleware for admin authorization
const authorizeAdmin = (req, res, next) => {
  console.log("User role:", req.user.role);  // Log the user role for debugging
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// Middleware to Protect Routes
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    console.error("No token provided"); // Log error
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    console.log("Decoded JWT:", decoded); // Log decoded JWT for debugging
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Invalid token:", error); // Log error
    res.status(401).json({ message: "Invalid token" });
  }
};

// User Registration with Password Hashing & JWT Token
app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const userRole = role || "student"; // Default role to "student" if not provided
  try {
    const user = await FormDataModel.findOne({ email });
    if (user) {
      return res.status(400).json("Already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await FormDataModel.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      userId: newUser._id,
      token: token,
      role: newUser.role,
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: "Registration failed" });
  }
});

// User Login with Authentication
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await FormDataModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No user found with this email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, userId: user._id, role: user.role });
  } catch (error) {
    console.error("Login error:", error); // Log error for debugging
    res.status(500).json({ message: "Login error", error });
  }
});

// Route: Admin Adds a Course
app.post("/api/newCourse", authenticate, authorizeAdmin, async (req, res) => {
  const { title, description, duration, fee, details,contact,requirement } = req.body;
  console.log("Received course data:", req.body); // Debug log

  // Validate that all required fields are provided
  if (!title || !description || !duration || !fee) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newCourse = new CourseModel({
      title,
      description,
      duration,
      fee,
      details, // Add details here as per request
      contact,
      requirement,
    });

    await newCourse.save();
    res.status(201).json({ message: "Course added successfully", course: newCourse });
  } catch (error) {
    console.error("Course creation error:", error); // Log error for debugging
    res.status(500).json({ message: "Error adding course", error: error.message }); // Detailed error message
  }
});

// Route: Fetch All Users (admin only)
app.get("/api/users", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const users = await FormDataModel.find(); // Fetch all users from FormDataModel
    res.json(users); // Return the users
  } catch (error) {
    console.error("Error fetching users:", error); // Log error for debugging
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Route: Fetch All Courses
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await CourseModel.find();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error); // Log error for debugging
    res.status(500).json({ message: "Error fetching courses", error });
  }
});

// Route: Fetch a specific user by ID (admin only)
app.get("/api/users/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  console.log(`Fetching user ${id} - Requested by ${req.user.userId} (Role: ${req.user.role})`);

  try {
    if (req.user.role === "admin" || req.user.userId === id) {
      const user = await FormDataModel.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(user);
    }

    return res.status(403).json({ message: "Access denied." });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user", error });
  }
});




// Route to delete a user (admin only)
app.delete("/api/users/:id", authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await FormDataModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error });
  }
});

// Route: Submit Application Form
app.post("/api/application", authenticate, async (req, res) => {
  try {
    const newApplication = new ApplicationForm(req.body);
    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully!", application: newApplication });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({ message: "Error submitting application", error: error.message });
  }
});

// Route: Fetch All Applications (Admin Only)
app.get("/api/applications", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const applications = await ApplicationForm.find();
    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Error fetching applications", error });
  }
});


// Route: Fetch a Specific Application by ID
app.get("/api/application/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const application = await ApplicationForm.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ message: "Error fetching application", error });
  }
});


// Route: Delete Application (Admin Only)
app.delete("/api/application/:id", authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const application = await ApplicationForm.findByIdAndDelete(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Error deleting application", error });
  }
});





// Start Server
app.listen(3001, () => {
  console.log("Server listening on http://127.0.0.1:3001");
});
