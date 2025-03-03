const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fields: [
    {
      type: { type: String, required: true }, // text, number, dropdown, etc.
      label: { type: String, required: true }, // Example: "Full Name"
      options: { type: [String], default: [] }, // If dropdown, checkbox, etc.
      required: { type: Boolean, default: false } // If the field is required
    }
  ],
}, { timestamps: true });

const FormModel = mongoose.model("Form", FormSchema);
module.exports = FormModel;


