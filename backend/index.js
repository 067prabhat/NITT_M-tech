const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const UserModel = require("./models/User");
const CourseModel = require("./models/Course");
const {body , validationResult} = require("express-validator");
const ApplicationForm = require("./models/ApplicationForm");
const FormModel = require("./models/Form"); 
const formRoutes = require("./routes/formRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const app = express();
app.use(express.json({limit: " 10mb"}));
app.use(express.urlencoded({limit : "10mb" , extended: true}));
app.use(
  cors({
    origin: "http://localhost:5173",  // Allow frontend access
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true
  })
);
app.options("*", cors());
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use("/api/forms", formRoutes);  // Register form routes

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";


app.use("/api/notices", noticeRoutes);
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


app.post("/register", async (req, res) => {
  const { name, email, password } = req.body; // No role input
  const userRole = "student"; // Assign "student" role by default

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
      role: userRole, // Always "student"
    });

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Our Platform!",
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for registering on our platform! 🎉</p>
        <p>You can now log in using your registered email.</p>
        <p><strong>Happy Learning! 🚀</strong></p>
        <br>
        <p>Best Regards,</p>
        <p><strong>Your Team</strong></p>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(201).json({
      userId: newUser._id,
      token,
      role: newUser.role,
      message: `Registered successfully as ${newUser.role}`,
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
    return res.status(200).json({ token, userId: user._id, role: user.role,jwt_token:token });
  } catch (error) {
    console.error("Login error:", error); // Log error for debugging
   return res.status(500).json({ message: "Login error", error });
  }
});

// Route: Admin Adds a Course

const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8); // Generates an 8-character password
};

app.post("/api/newCourse", authenticate, authorizeAdmin, async (req, res) => {
  const { title, description, contentAdminName,contentAdminEmail} = req.body;

  if (!title || !description|| !contentAdminName|| !contentAdminEmail  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  
  try {

    let contentAdmin = await UserModel.findOne({ email:contentAdminEmail });
    
    const generatedPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    
    if (!contentAdmin) {
      
      contentAdmin = new UserModel({
        name:contentAdminName,
        email:contentAdminEmail,
        password: hashedPassword,
        role: "content_admin",
      });
      await contentAdmin.save();
    }

    const newCourse = new CourseModel({
      title,
      description,
      contentAdmins:[contentAdmin._id], // Assign content admins when creating the course
    });

    await newCourse.save();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: contentAdminEmail,
      subject: "Your Content Admin Credentials",
      text: `Hello ,${contentAdminName}\n\nYou have been assigned as the content admin for the course: "${title}".\n\nYour login credentials:\nEmail: ${contentAdminEmail}\nPassword: ${generatedPassword}\n\nPlease change your password after logging in.\n\nBest Regards,\nAdmin Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Error sending email", error });
      }
      console.log("Email sent:", info.response);
    });

    res.status(201).json({
      message: "Course added successfully",
      newCourse
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding course", error: error.message });
  }
});

app.put("/api/courses/:courseId", authenticate, authorizeContentAdmin, async (req, res) => {
  const { courseId } = req.params;
  const updateData = req.body;

  try {
    const course = await CourseModel.findByIdAndUpdate(courseId, updateData, { new: true });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error: error.message });
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


app.post("/api/courses/:courseId/add-description", authenticate, authorizeContentAdmin, async (req, res) => {
  const { courseId } = req.params;
  const {
    programDescription,
    image1,
    image2,
    vision,
    mission,
    yearsOfDepartment,
    syllabus,
    programEducationalObjectives,
    programOutcomes,
  } = req.body;
  console.log("Received data:", req.body); // Log the received data
  // Validate required fields
  if (
    !programDescription ||
    !image1 ||
    !image2 ||
    !vision ||
    !mission ||
    !yearsOfDepartment ||
    !syllabus ||
    !programEducationalObjectives ||
    !programOutcomes
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Find the course by ID
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update the course with the new description
    course.programDescription = programDescription;
    course.image1 = image1;
    course.image2 = image2;
    course.vision = vision;
    course.mission = mission;
    course.yearsOfDepartment = yearsOfDepartment;
    course.syllabus = syllabus;
    course.programEducationalObjectives = programEducationalObjectives;
    course.programOutcomes = programOutcomes;
    console.log("Updated course:", course);  //Log the updated course
    await course.save();

    res.status(200).json({ message: "Course description added successfully!", course });
  } catch (error) {
    console.error("Error adding course description:", error);
    res.status(500).json({ message: "Error adding course description", error: error.message });
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


// Change Password Route
app.put("/change-password",authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Validate input fields
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "New passwords do not match." });
    }

    const userId = req.user.userId; // Retrieved from JWT by authenticate middleware

    // Find user by ID
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully!" });

  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Something went wrong. Try again later." });
  }
});




// Start Server
app.listen(3001, () => {
  console.log("Server listening on http://127.0.0.1:3001");
});
