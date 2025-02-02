const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const FormDataModel = require("./models/FormData");
const CourseModel = require("./models/Course");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
  })
);

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// User Registration with Password Hashing & JWT Token
app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;  // Now receiving role from frontend

  // Default role to "student" if not provided
  const userRole = role || "student";  // If role is not passed, default to student

  try {
    // Check if the user already exists
    const user = await FormDataModel.findOne({ email });
    if (user) {
      return res.status(400).json("Already registered");
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user with hashed password and role
    const newUser = await FormDataModel.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,  // Store the role in the database
    });

    // Generate JWT token including the user's role
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },  // Include role in token payload
      process.env.JWT_SECRET,  // Assuming the secret is in environment variables
      { expiresIn: "1h" }  // Set token expiration time
    );

    // Send the response with the user ID and token
    res.json({
      userId: newUser._id,
      token: token,
      role: newUser.role,  // Send the user's role in the response
    });
  } catch (error) {
    console.error(error);
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

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },  // Include role in JWT payload
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, userId: user._id, role: user.role });  // Send role in response
  } catch (error) {
    res.status(500).json({ message: "Login error", error });
  }
});


// Middleware to Protect Routes
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = decoded; // Store the decoded user info in the request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};


app.get("/user/:userId", authenticate, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await FormDataModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      name: user.name,
      email: user.email,
      courses: user.courses || [] // Assuming 'courses' is an array field in the user model
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data" });
  }
});



// Example Protected Route
app.get("/api/protected", authenticate, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// Start Server
app.listen(3001, () => {
  console.log("Server listening on http://127.0.0.1:3001");
});
