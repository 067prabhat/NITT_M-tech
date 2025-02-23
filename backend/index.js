const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserModel = require("./models/User");
const CourseModel = require("./models/Course");
const ApplicationForm = require("./models/ApplicationForm");
const FormModel = require("./models/Form"); 
const formRoutes = require("./routes/formRoutes");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",  // Allow frontend access
    methods: "GET,POST,PUT,DELETE",
    credentials: true
  })
);

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use("/api/forms", formRoutes);  // Register form routes
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Middleware for admin authorization
const authorizeAdmin = (req, res, next) => {
  console.log("User role:", req.user.role);  // Log the user role for debugging
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
const authorizeContentAdmin = (req, res, next) => {
  if (req.user.role !== "content_admin") {
    return res.status(403).json({ message: "Access denied. Content Admins only." });
  }
  next();
};
// Middleware to Protect Routes
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    console.error("No token provided");
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    
    if (!decoded || !decoded.role) {
      return res.status(401).json({ message: "Invalid token structure" });
    }

    req.user = decoded;
    console.log("Authenticated user:", req.user); // Debugging log
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};


// User Registration with Password Hashing & JWT Token
app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const allowedRoles = ["student", "admin", "content_admin"]; // Only allow these roles
  const userRole = allowedRoles.includes(role) ? role : "student"; // Default to student if invalid role
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json("Already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
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

    res.status(201).json({
      userId: newUser._id,
      token,
      role: newUser.role,
      message: `Registered successfully as ${newUser.role}`,
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
    const user = await UserModel.findOne({ email });
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
    console.log("Generated JWT Token:", token); // ✅ Log the token
    res.json({ token, userId: user._id, role: user.role });
  } catch (error) {
    console.error("Login error:", error); // Log error for debugging
    res.status(500).json({ message: "Login error", error });
  }
});

// Route: Admin Adds a Course
app.post("/api/newCourse", authenticate, authorizeAdmin, async (req, res) => {
  const { title, description, duration, fee, details, contact, requirement } = req.body;
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
      details,
      contact,
      requirement,
    });

    await newCourse.save();

    // Send back the generated course ID so Content Admin can use it
    res.status(201).json({
      message: "Course added successfully",
      courseId: newCourse._id, // Return courseId
      course: newCourse,
    });
  } catch (error) {
    console.error("Course creation error:", error); // Log error for debugging
    res.status(500).json({ message: "Error adding course", error: error.message });
  }
});


// Route: Fetch All Users (admin only)
app.get("/api/users", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const users = await UserModel.find(); // Fetch all users from FormDataModel
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
    const user = await UserModel.findByIdAndDelete(id);
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

app.post("/api/forms/create", authenticate, async (req, res) => {
  if (req.user.role !== "content_admin") {
    return res.status(403).json({ message: "Access denied. Content admins only." });
  }

  try {
    const { courseId, fields } = req.body;

    if (!courseId || !fields || !Array.isArray(fields)) {
      return res.status(400).json({ message: "Invalid form data." });
    }

    const newForm = new FormModel({
      courseId,
      createdBy: req.user.userId,
      fields,
    });

    await newForm.save();
    res.status(201).json({ message: "Form created successfully!", form: newForm });
  } catch (error) {
    console.error("Error creating form:", error);
    res.status(500).json({ message: "Error creating form", error: error.message });
  }
});




// Start Server
app.listen(3001, () => {
  console.log("Server listening on http://127.0.0.1:3001");
});
