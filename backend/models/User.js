const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: {type: String, required: true},
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin", "content_admin"], default: "student" } // Default to student
});

module.exports = mongoose.model("User", UserSchema);
